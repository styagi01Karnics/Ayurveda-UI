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

        stage('Checkout') {
            steps {
                echo '===== Checkout ====='
                checkout scm
            }
        }

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

        stage('Install Dependencies') {
            steps {
                sh '''
                    echo "===== Install Dependencies ====="
                    npm ci
                '''
            }
        }

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

                            docker tag ${IMAGE_NAME}:${BUILD_NUMBER} ${IMAGE_NAME}:latest

                            docker push ${IMAGE_NAME}:latest
                        """
                    }
                }
            }
        }

        stage('DevOps Server Cleanup') {
            steps {
                sh '''
                    echo "===== DevOps Server Cleanup ====="

                    echo "Removing build-number image tag..."
                    docker rmi "${IMAGE_NAME}:${BUILD_NUMBER}" || true

                    echo "Removing old numeric image tags..."

                    OLD_TAGS=$(docker images "${IMAGE_NAME}" \
                        --format '{{.Tag}}' \
                        | grep -E '^[0-9]+$' || true)

                    for TAG in $OLD_TAGS
                    do
                        echo "Removing local tag: ${IMAGE_NAME}:${TAG}"
                        docker rmi "${IMAGE_NAME}:${TAG}" || true
                    done

                    echo "Removing dangling images..."
                    docker image prune -f

                    echo "===== Remaining DevOps Images ====="
                    docker images "${IMAGE_NAME}"
                '''
            }
        }

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

                        echo "Ayurveda UI deployment verified successfully."
                    '''
                }
            }
        }

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

echo "===== Images Before Cleanup ====="

docker images "\$IMAGE_NAME" \
    --format 'table {{.Repository}}\\t{{.Tag}}\\t{{.CreatedSince}}\\t{{.ID}}'

echo ""
echo "===== Removing latest Tag ====="

docker rmi "\$IMAGE_NAME:latest" 2>/dev/null || true

echo ""
echo "===== Keeping Latest 3 Build Images ====="

TAGS=\$(docker images "\$IMAGE_NAME" \
    --format '{{.Tag}}' \
    | grep -E '^[0-9]+$' \
    | sort -nr || true)

COUNT=0

for TAG in \$TAGS
do
    COUNT=\$((COUNT + 1))

    if [ "\$COUNT" -le 3 ]
    then
        echo "Keeping image: \$IMAGE_NAME:\$TAG"
    else
        echo "Removing old image: \$IMAGE_NAME:\$TAG"
        docker rmi "\$IMAGE_NAME:\$TAG" || true
    fi
done

echo ""
echo "===== Removing Dangling Images ====="

docker image prune -f

echo ""
echo "===== Images After Cleanup ====="

docker images "\$IMAGE_NAME" \
    --format 'table {{.Repository}}\\t{{.Tag}}\\t{{.CreatedSince}}\\t{{.ID}}'

REMOTE_SCRIPT
                    '''
                }
            }
        }
    }

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
Current image only

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
