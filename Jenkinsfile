pipeline {

    agent any

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

                    echo "===== Verify Build ====="

                    test -d dist
                    test -f dist/index.html

                    echo "React production build successful."
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

                    echo "All deployment files found."
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
                        "${IMAGE_NAME}:${BUILD_NUMBER}"
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
                            docker push ${IMAGE_NAME}:${BUILD_NUMBER}

                            docker tag \
                                ${IMAGE_NAME}:${BUILD_NUMBER} \
                                ${IMAGE_NAME}:latest

                            docker push ${IMAGE_NAME}:latest
                        """
                    }
                }
            }
        }


        // ==========================================================
        // DEVOPS SERVER CLEANUP
        //
        // Keep CURRENT IMAGE ONLY as latest
        // ==========================================================

        stage('DevOps Server Cleanup') {
            steps {

                echo "===== DevOps Server Docker Cleanup ====="

                sh '''
                    echo "===== Cleaning Jenkins Docker Images ====="

                    # Remove build-number tag.
                    # The same image remains available as :latest
                    docker rmi "${IMAGE_NAME}:${BUILD_NUMBER}" || true

                    # Remove old numeric tags for this application
                    TAGS=$(docker images "${IMAGE_NAME}" \
                        --format '{{.Tag}}' \
                        | grep -E '^[0-9]+$' \
                        || true)

                    for TAG in $TAGS; do
                        echo "Removing old local build tag: ${IMAGE_NAME}:${TAG}"
                        docker rmi "${IMAGE_NAME}:${TAG}" || true
                    done

                    # Remove dangling images
                    docker image prune -f

                    echo "===== DevOps Server Images ====="

                    docker images "${IMAGE_NAME}" \
                        --format 'table {{.Repository}}\\t{{.Tag}}\\t{{.CreatedSince}}\\t{{.ID}}'
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
                        echo "===== Copy docker-compose.yml ====="

                        sshpass -p "$SSH_PASSWORD" scp \
                            -o StrictHostKeyChecking=no \
                            docker-compose.yml \
                            "$SSH_USER@$APP_SERVER:$DEPLOY_DIR/docker-compose.yml"
                    '''
                }
            }
        }


        // ==========================================================
        // DEPLOY TO APPLICATION SERVER
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
                        echo "===== Deploy Ayurveda UI ====="

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USER@$APP_SERVER" \
                            "cd $DEPLOY_DIR && \
                             export IMAGE_NAME=$IMAGE_NAME && \
                             export IMAGE_TAG=$BUILD_NUMBER && \
                             docker compose pull && \
                             docker compose up -d --remove-orphans"
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

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USER@$APP_SERVER" \
                            "docker compose -f $DEPLOY_DIR/docker-compose.yml ps"

                        echo "===== Nginx Verification ====="

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USER@$APP_SERVER" \
                            "docker exec $APP_NAME nginx -t"

                        echo "===== HTTP Verification ====="

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USER@$APP_SERVER" \
                            "curl -f http://127.0.0.1:$APP_PORT/"

                        echo "Ayurveda UI deployment verified successfully."
                    '''
                }
            }
        }


        // ==========================================================
        // APPLICATION SERVER CLEANUP
        //
        // Keep:
        //   Current build
        //   Previous build
        //   Previous previous build
        //
        // Total = LAST 3 BUILD IMAGES
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
                        echo "===== Application Server Image Cleanup ====="

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USER@$APP_SERVER" \
                            "bash -s" <<'REMOTE_SCRIPT'

set -e

IMAGE_NAME="sunardock/ayurvedaa-ui"

echo "===== Images Before Cleanup ====="

docker images "$IMAGE_NAME" \
    --format '{{.Tag}} {{.CreatedAt}} {{.ID}}'

echo ""
echo "===== Removing latest tag if present ====="

# Deployment uses numeric build tags.
# Remove :latest so only the last 3 build versions remain.
docker rmi "$IMAGE_NAME:latest" 2>/dev/null || true

echo ""
echo "===== Keeping Latest 3 Build Images ====="

# Get numeric build tags, newest first
TAGS=\$(docker images "$IMAGE_NAME" \
    --format '{{.Tag}}' \
    | grep -E '^[0-9]+$' \
    | sort -nr \
    || true)

COUNT=0

for TAG in \$TAGS; do

    COUNT=\$((COUNT + 1))

    if [ "\$COUNT" -gt 3 ]; then

        echo "Removing old image: \$IMAGE_NAME:\$TAG"

        docker rmi "$IMAGE_NAME:\$TAG" || true

    else

        echo "Keeping image: \$IMAGE_NAME:\$TAG"

    fi

done

echo ""
echo "===== Removing Dangling Images ====="

docker image prune -f

echo ""
echo "===== Images After Cleanup ====="

docker images "$IMAGE_NAME" \
    --format 'table {{.Repository}}\\t{{.Tag}}\\t{{.CreatedSince}}\\t{{.ID}}'

REMOTE_SCRIPT
                '''
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

            Build        : ${BUILD_NUMBER}
            Docker Image : ${IMAGE_NAME}:${BUILD_NUMBER}
            Server       : ${APP_SERVER}
            Port         : ${APP_PORT}

            URL:
            http://${APP_SERVER}:${APP_PORT}

            DevOps Server:
            Current image only (:latest)

            Application Server:
            Last 3 build images

            ============================================
            """
        }


        failure {

            echo """
            ============================================
            AYURVEDAA UI DEPLOYMENT FAILED
            ============================================

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
