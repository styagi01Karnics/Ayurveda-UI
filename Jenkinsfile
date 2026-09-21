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
        // Keep ONLY current UI image
        // ==========================================================

        stage('DevOps Server Cleanup') {
            steps {
                sh '''
                    echo "===== DevOps Server Cleanup ====="

                    CURRENT_IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"

                    echo "Current image to keep:"
                    echo "$CURRENT_IMAGE"

                    echo ""
                    echo "===== UI Images Before Cleanup ====="

                    docker images "$IMAGE_NAME" \
                        --format '{{.Repository}}:{{.Tag}}'

                    echo ""
                    echo "===== Removing Old UI Images ====="

                    docker images "$IMAGE_NAME" \
                        --format '{{.Repository}}:{{.Tag}}' |
                    while IFS= read -r IMAGE
                    do
                        [ -z "$IMAGE" ] && continue

                        if [ "$IMAGE" = "$CURRENT_IMAGE" ]
                        then
                            echo "KEEPING: $IMAGE"
                        else
                            echo "REMOVING: $IMAGE"
                            docker image rm "$IMAGE" || true
                        fi
                    done

                    echo ""
                    echo "===== Removing Dangling Images ====="

                    docker image prune -f

                    echo ""
                    echo "===== Remaining UI Images ====="

                    docker images "$IMAGE_NAME"
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
                script {

                    def deployScript = '''#!/bin/bash

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

exec 9>/var/lock/ayurvedaa-ui-deployment.lock

if ! flock -n 9; then
    echo "ERROR: Another Ayurvedaa UI deployment is already running."
    exit 1
fi

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
'''

                    writeFile(
                        file: 'deploy-ayurvedaa-ui.sh',
                        text: deployScript
                    )

                    sh '''
                        chmod +x deploy-ayurvedaa-ui.sh
                    '''

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

                            echo "===== Copy Deployment Script ====="

                            sshpass -p "$SSH_PASSWORD" scp \
                                -o StrictHostKeyChecking=no \
                                deploy-ayurvedaa-ui.sh \
                                "$SSH_USER@$APP_SERVER:/tmp/deploy-ayurvedaa-ui.sh"

                            echo "===== Execute Deployment Script ====="

                            sshpass -p "$SSH_PASSWORD" ssh \
                                -o StrictHostKeyChecking=no \
                                "$SSH_USER@$APP_SERVER" \
                                bash /tmp/deploy-ayurvedaa-ui.sh \
                                "$DEPLOY_DIR" \
                                "$IMAGE_NAME" \
                                "$IMAGE_TAG" \
                                "$BRANCH_NAME" \
                                "$BUILD_NUMBER" \
                                "$APP_NAME"

                            echo "===== Remove Remote Deployment Script ====="

                            sshpass -p "$SSH_PASSWORD" ssh \
                                -o StrictHostKeyChecking=no \
                                "$SSH_USER@$APP_SERVER" \
                                rm -f /tmp/deploy-ayurvedaa-ui.sh

                            echo "===== Deployment SSH Stage Completed ====="
                        '''
                    }

                    sh '''
                        rm -f deploy-ayurvedaa-ui.sh
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
        //
        // KEEP:
        // 1. Currently running UI image
        // 2. Newest other UI image
        // 3. Second-newest other UI image
        //
        // DELETE:
        // All older UI images only
        // ==========================================================

        stage('Application Server Cleanup') {
            steps {

                script {

                    def cleanupScript = '''#!/bin/bash

set -e

IMAGE_NAME="sunardock/ayurvedaa-ui"
APP_NAME="ayurvedaa-ui"

echo "============================================"
echo "Ayurvedaa UI Image Cleanup"
echo "============================================"

echo ""
echo "===== Running UI Container ====="

RUNNING_IMAGE=$(docker inspect "$APP_NAME" \
    --format '{{.Config.Image}}' 2>/dev/null || true)

if [ -z "$RUNNING_IMAGE" ]; then
    echo "ERROR: Could not determine the currently running UI image."
    exit 1
fi

echo "Current running image:"
echo "$RUNNING_IMAGE"

echo ""
echo "===== UI Images Before Cleanup ====="

docker images "$IMAGE_NAME" \
    --format '{{.Repository}}:{{.Tag}}'

echo ""
echo "===== Finding UI Images ====="

TMP_ALL="/tmp/ayurvedaa-ui-all-images.txt"
TMP_KEEP="/tmp/ayurvedaa-ui-keep-images.txt"

rm -f "$TMP_ALL" "$TMP_KEEP"

docker images "$IMAGE_NAME" \
    --format '{{.Repository}}:{{.Tag}}' > "$TMP_ALL"

echo ""
echo "===== Images To Keep ====="

echo "$RUNNING_IMAGE" >> "$TMP_KEEP"

COUNT=0

while IFS= read -r IMAGE
do
    [ -z "$IMAGE" ] && continue

    if [ "$IMAGE" = "$RUNNING_IMAGE" ]
    then
        continue
    fi

    CREATED=$(docker image inspect "$IMAGE" \
        --format '{{.Created}}' 2>/dev/null || true)

    if [ -z "$CREATED" ]
    then
        continue
    fi

    printf '%s|%s\\n' "$CREATED" "$IMAGE"

done < "$TMP_ALL" |
sort -r |
head -n 2 |
cut -d'|' -f2 >> "$TMP_KEEP"

echo ""
echo "Images being kept:"

sort -u "$TMP_KEEP"

echo ""
echo "===== Removing Old UI Images ====="

while IFS= read -r IMAGE
do
    [ -z "$IMAGE" ] && continue

    if grep -Fxq "$IMAGE" "$TMP_KEEP"
    then
        echo "KEEPING: $IMAGE"
    else
        echo "REMOVING: $IMAGE"

        docker image rm "$IMAGE" || true
    fi

done < "$TMP_ALL"

echo ""
echo "===== Removing Dangling Images ====="

docker image prune -f

echo ""
echo "===== UI Images After Cleanup ====="

docker images "$IMAGE_NAME" \
    --format 'table {{.Repository}}\\t{{.Tag}}\\t{{.CreatedAt}}\\t{{.ID}}'

rm -f "$TMP_ALL" "$TMP_KEEP"

echo ""
echo "============================================"
echo "UI Image Cleanup Completed"
echo "============================================"
'''

                    writeFile(
                        file: 'cleanup-ayurvedaa-ui.sh',
                        text: cleanupScript
                    )

                    sh '''
                        chmod +x cleanup-ayurvedaa-ui.sh
                    '''

                    withCredentials([
                        usernamePassword(
                            credentialsId: "${SSH_CREDENTIALS}",
                            usernameVariable: 'SSH_USER',
                            passwordVariable: 'SSH_PASSWORD'
                        )
                    ]) {

                        sh '''
                            echo "===== Copy Cleanup Script ====="

                            sshpass -p "$SSH_PASSWORD" scp \
                                -o StrictHostKeyChecking=no \
                                cleanup-ayurvedaa-ui.sh \
                                "$SSH_USER@$APP_SERVER:/tmp/cleanup-ayurvedaa-ui.sh"

                            echo "===== Execute Cleanup Script ====="

                            sshpass -p "$SSH_PASSWORD" ssh \
                                -o StrictHostKeyChecking=no \
                                "$SSH_USER@$APP_SERVER" \
                                bash /tmp/cleanup-ayurvedaa-ui.sh

                            echo "===== Remove Remote Cleanup Script ====="

                            sshpass -p "$SSH_PASSWORD" ssh \
                                -o StrictHostKeyChecking=no \
                                "$SSH_USER@$APP_SERVER" \
                                rm -f /tmp/cleanup-ayurvedaa-ui.sh
                        '''
                    }

                    sh '''
                        rm -f cleanup-ayurvedaa-ui.sh
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
