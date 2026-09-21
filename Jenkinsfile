pipeline {

    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        skipDefaultCheckout(true)

        buildDiscarder(
            logRotator(
                numToKeepStr: '3'
            )
        )
    }

    environment {
        APP_NAME = 'ayurvedaa-ui'
        IMAGE_NAME = 'sunardock/ayurvedaa-ui'

        APP_SERVER = '45.195.229.15'
        DEPLOY_DIR = '/root/ayurvedaa-ui'
        APP_PORT = '8100'

        DOCKER_CREDENTIALS = 'dockerhub-creds'
        SSH_CREDENTIALS = 'new-server-ssh'
    }

    stages {

        // ==========================================================
        // INITIALIZE
        // ==========================================================

        stage('Initialize') {
            steps {
                script {

                    env.SAFE_BRANCH = (env.BRANCH_NAME ?: 'unknown')
                        .replaceAll('[^A-Za-z0-9_.-]', '-')

                    env.IMAGE_TAG = "${env.SAFE_BRANCH}-${env.BUILD_NUMBER}"

                    echo "============================================"
                    echo "Ayurvedaa UI Multibranch Build"
                    echo "============================================"
                    echo "Branch      : ${env.BRANCH_NAME}"
                    echo "Safe Branch : ${env.SAFE_BRANCH}"
                    echo "Build       : ${env.BUILD_NUMBER}"
                    echo "Image Tag   : ${env.IMAGE_TAG}"
                    echo "Docker Image: ${env.IMAGE_NAME}:${env.IMAGE_TAG}"
                    echo "============================================"
                }
            }
        }

        // ==========================================================
        // CHECKOUT
        // ==========================================================

        stage('Checkout') {
            steps {
                echo '===== Checkout ====='

                checkout scm
            }
        }

        // ==========================================================
        // ENVIRONMENT CHECK
        // ==========================================================

        stage('Environment Check') {
            steps {
                sh '''
                    echo "===== Environment Check ====="

                    node --version
                    npm --version
                    docker --version
                    git --version
                '''
            }
        }

        // ==========================================================
        // INSTALL DEPENDENCIES
        // ==========================================================

        stage('Install Dependencies') {
            steps {
                sh '''
                    echo "===== Install Dependencies ====="

                    npm ci
                '''
            }
        }

        // ==========================================================
        // BUILD REACT APPLICATION
        // ==========================================================

        stage('Build React Application') {
            steps {
                sh '''
                    echo "===== Build React Application ====="

                    npm run build

                    echo "===== Verify React Build ====="

                    test -d dist
                    test -f dist/index.html

                    echo "React build successful."
                '''
            }
        }

        // ==========================================================
        // VERIFY DEPLOYMENT FILES
        // ==========================================================

        stage('Verify Deployment Files') {
            steps {
                sh '''
                    echo "===== Verify Deployment Files ====="

                    test -f Dockerfile
                    test -f nginx.conf
                    test -f docker-compose.yml

                    echo "Dockerfile found."
                    echo "nginx.conf found."
                    echo "docker-compose.yml found."
                '''
            }
        }

        // ==========================================================
        // DOCKER BUILD
        // ==========================================================

        stage('Docker Build') {
            steps {
                script {

                    echo "===== Docker Build ====="

                    docker.build(
                        "${IMAGE_NAME}:${IMAGE_TAG}"
                    )
                }
            }
        }

        // ==========================================================
        // DOCKER PUSH
        // ==========================================================

        stage('Docker Push') {
            steps {
                script {

                    echo "===== Docker Push ====="

                    docker.withRegistry(
                        'https://index.docker.io/v1/',
                        "${DOCKER_CREDENTIALS}"
                    ) {

                        sh """
                            docker push ${IMAGE_NAME}:${IMAGE_TAG}
                        """
                    }
                }
            }
        }

        // ==========================================================
        // DEVOPS SERVER CLEANUP
        // ==========================================================

        stage('DevOps Server Cleanup') {
            steps {
                sh '''
                    echo "===== DevOps Server Cleanup ====="

                    echo "Removing local build image..."

                    docker rmi "${IMAGE_NAME}:${IMAGE_TAG}" || true

                    echo "Removing dangling images..."

                    docker image prune -f

                    echo "===== Remaining Local UI Images ====="

                    docker images "${IMAGE_NAME}"
                '''
            }
        }

        // ==========================================================
        // PREPARE APPLICATION SERVER
        // ==========================================================

        stage('Prepare Application Server') {
            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: "${SSH_CREDENTIALS}",
                        usernameVariable: 'SSH_USER',
                        passwordVariable: 'SSH_PASSWORD'
                    )
                ]) {

                    sh '''
                        echo "===== Prepare Application Server ====="

                        command -v sshpass >/dev/null 2>&1 || {
                            echo "ERROR: sshpass is not installed on Jenkins server."
                            exit 1
                        }

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USER@$APP_SERVER" \
                            "mkdir -p $DEPLOY_DIR"
                    '''
                }
            }
        }

        // ==========================================================
        // COPY DOCKER COMPOSE
        // ==========================================================

        stage('Copy Docker Compose') {
            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: "${SSH_CREDENTIALS}",
                        usernameVariable: 'SSH_USER',
                        passwordVariable: 'SSH_PASSWORD'
                    )
                ]) {

                    sh '''
                        echo "===== Copy Docker Compose ====="

                        sshpass -p "$SSH_PASSWORD" scp \
                            -o StrictHostKeyChecking=no \
                            docker-compose.yml \
                            "$SSH_USER@$APP_SERVER:$DEPLOY_DIR/docker-compose.yml"
                    '''
                }
            }
        }

        // ==========================================================
        // DEPLOY
        // ==========================================================

        stage('Deploy to Application Server') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: "${SSH_CREDENTIALS}",
                        usernameVariable: 'SSH_USER',
                        passwordVariable: 'SSH_PASSWORD'
                    )
                ]) {
                    sh '''
                        echo "============================================"
                        echo "===== Deploy Ayurvedaa UI ====="
                        echo "============================================"
        
                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USER@$APP_SERVER" \
                            bash -s -- \
                            "$DEPLOY_DIR" \
                            "$IMAGE_NAME" \
                            "$IMAGE_TAG" \
                            "$BRANCH_NAME" \
                            "$BUILD_NUMBER" \
                            "$APP_NAME" <<'REMOTE_SCRIPT'
        
        set -e
        
        APP_DIR="$1"
        IMAGE_NAME="$2"
        IMAGE_TAG="$3"
        BRANCH_NAME="$4"
        BUILD_NUMBER="$5"
        APP_NAME="$6"
        
        echo "============================================"
        echo "Ayurvedaa UI Deployment"
        echo "============================================"
        echo "Branch      : $BRANCH_NAME"
        echo "Build       : $BUILD_NUMBER"
        echo "Image       : $IMAGE_NAME:$IMAGE_TAG"
        echo "Server      : 45.195.229.15"
        echo "Deploy Dir  : $APP_DIR"
        echo "============================================"
        
        echo ""
        echo "===== Acquiring Deployment Lock ====="
        
        (
            flock -n 9
        
            echo "Deployment lock acquired."
            echo ""
        
            cd "$APP_DIR"
        
            echo "===== Current Containers ====="
            docker compose ps || true
        
            echo ""
            echo "===== Stopping Existing UI Deployment ====="
            docker compose down --remove-orphans
        
            echo ""
            echo "===== Pulling New UI Image ====="
            IMAGE_NAME="$IMAGE_NAME" IMAGE_TAG="$IMAGE_TAG" docker compose pull
        
            echo ""
            echo "===== Starting New UI Deployment ====="
            IMAGE_NAME="$IMAGE_NAME" IMAGE_TAG="$IMAGE_TAG" docker compose up -d --remove-orphans
        
            echo ""
            echo "===== New Containers ====="
            docker compose ps
        
            echo ""
            echo "===== Deployment Completed ====="
        
        ) 9>/var/lock/ayurvedaa-ui-deployment.lock
        
        REMOTE_SCRIPT
                    '''
                }
            }
        }
        
        // ==========================================================
        // CONTAINER VERIFICATION
        // ==========================================================

        stage('Container Verification') {
            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: "${SSH_CREDENTIALS}",
                        usernameVariable: 'SSH_USER',
                        passwordVariable: 'SSH_PASSWORD'
                    )
                ]) {

                    sh '''
                        echo "===== Container Verification ====="

                        sleep 10

                        echo "===== Docker Compose Status ====="

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USER@$APP_SERVER" \
                            "cd $DEPLOY_DIR && docker compose ps"

                        echo "===== Nginx Configuration Test ====="

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USER@$APP_SERVER" \
                            "docker exec $APP_NAME nginx -t"

                        echo "===== HTTP Verification ====="

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USER@$APP_SERVER" \
                            "curl -f http://127.0.0.1:$APP_PORT/"

                        echo ""
                        echo "Ayurvedaa UI deployment verified successfully."
                    '''
                }
            }
        }

        // ==========================================================
        // APPLICATION SERVER CLEANUP
        // Keep newest 3 UI images
        // ==========================================================

        stage('Application Server Cleanup') {
            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: "${SSH_CREDENTIALS}",
                        usernameVariable: 'SSH_USER',
                        passwordVariable: 'SSH_PASSWORD'
                    )
                ]) {

                    sh '''
                        echo "===== Application Server Cleanup ====="

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USER@$APP_SERVER" \
                            "bash -s" <<REMOTE_SCRIPT

set -e

IMAGE_NAME="sunardock/ayurvedaa-ui"

echo "============================================"
echo "Ayurvedaa UI Image Cleanup"
echo "============================================"

echo ""
echo "===== Images Before Cleanup ====="

docker images "\$IMAGE_NAME" \
    --format 'table {{.Repository}}\\t{{.Tag}}\\t{{.CreatedAt}}\\t{{.ID}}'

echo ""
echo "===== Finding Images By Creation Time ====="

IMAGE_LIST=\$(docker images "\$IMAGE_NAME" \
    --format '{{.CreatedAt}}|{{.Repository}}:{{.Tag}}' \
    | sort -r)

COUNT=0

while IFS='|' read -r CREATED IMAGE
do

    [ -z "\$IMAGE" ] && continue

    COUNT=\$((COUNT + 1))

    if [ "\$COUNT" -le 3 ]
    then

        echo "Keeping: \$IMAGE"

    else

        echo "Checking old image: \$IMAGE"

        RUNNING=\$(docker ps \
            --filter "ancestor=\$IMAGE" \
            --format '{{.ID}}')

        if [ -n "\$RUNNING" ]
        then

            echo "SKIPPING running image: \$IMAGE"

        else

            echo "Removing old image: \$IMAGE"

            docker image rm "\$IMAGE" || true

        fi
    fi

done <<EOF
\$IMAGE_LIST
EOF

echo ""
echo "===== Removing Dangling Images ====="

docker image prune -f

echo ""
echo "===== Images After Cleanup ====="

docker images "\$IMAGE_NAME" \
    --format 'table {{.Repository}}\\t{{.Tag}}\\t{{.CreatedAt}}\\t{{.ID}}'

REMOTE_SCRIPT
                    '''
                }
            }
        }
    }

    // ==========================================================
    // POST ACTIONS
    // ==========================================================

    post {

        success {

            echo """
============================================
AYURVEDAA UI DEPLOYMENT SUCCESSFUL
============================================

Branch       : ${env.BRANCH_NAME}
Build        : ${env.BUILD_NUMBER}
Docker Image : ${env.IMAGE_NAME}:${env.IMAGE_TAG}
Server       : ${env.APP_SERVER}
Port         : ${env.APP_PORT}

URL:
http://${env.APP_SERVER}:${env.APP_PORT}

============================================
"""
        }

        failure {

            echo """
============================================
AYURVEDAA UI DEPLOYMENT FAILED
============================================

Branch : ${env.BRANCH_NAME}
Build  : ${env.BUILD_NUMBER}

Check the failed Jenkins stage.

============================================
"""
        }

        always {

            echo "Cleaning Jenkins workspace..."

            cleanWs()
        }
    }
}
