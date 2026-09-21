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
                        sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                    }
                }
            }
        }

        // ==========================================================
        // DEVOPS SERVER CLEANUP
        // Keep ONLY the current UI image.
        // Do not touch any other application images.
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

                    docker images "$IMAGE_NAME"                         --format '{{.Repository}}:{{.Tag}}'

                    echo ""
                    echo "===== Removing Old UI Images ====="

                    docker images "$IMAGE_NAME"                         --format '{{.Repository}}:{{.Tag}}' |
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

                        sshpass -p "$SSH_PASSWORD" ssh                             -o StrictHostKeyChecking=no                             "$SSH_USER@$APP_SERVER"                             "mkdir -p $DEPLOY_DIR"
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

                        sshpass -p "$SSH_PASSWORD" scp                             -o StrictHostKeyChecking=no                             docker-compose.yml                             "$SSH_USER@$APP_SERVER:$DEPLOY_DIR/docker-compose.yml"
                    '''
                }
            }
        }

        // ==========================================================
        // DEPLOY
        //
        // Persistent history:
        // /root/ayurvedaa-ui/.ui-image-history
        //
        // The history stores:
        //   line 1 = current deployment
        //   line 2 = previous deployment
        //   line 3 = previous-previous deployment
        //
        // Missing previous images are pulled from Docker Hub when
        // possible. The current deployment is never blocked because
        // an old image no longer exists in Docker Hub.
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

CURRENT_IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"
HISTORY_FILE="${APP_DIR}/.ui-image-history"
HISTORY_TMP="${APP_DIR}/.ui-image-history.tmp"
CANDIDATE_FILE="${APP_DIR}/.ui-image-candidates.tmp"

echo "============================================"
echo "Ayurvedaa UI Deployment"
echo "============================================"
echo "Branch      : $BRANCH_NAME"
echo "Build       : $BUILD_NUMBER"
echo "Image       : $CURRENT_IMAGE"
echo "Server      : 45.195.229.15"
echo "Deploy Dir  : $APP_DIR"
echo "============================================"

exec 9>/var/lock/ayurvedaa-ui-deployment.lock

if ! flock -n 9; then
    echo "ERROR: Another Ayurvedaa UI deployment is already running."
    exit 1
fi

echo "Deployment lock acquired."

cd "$APP_DIR"

echo ""
echo "===== Current UI Container ====="

RUNNING_IMAGE=$(docker inspect "$APP_NAME"     --format='{{.Config.Image}}' 2>/dev/null || true)

if [ -n "$RUNNING_IMAGE" ]; then
    echo "Currently running image: $RUNNING_IMAGE"
else
    echo "No currently running UI container found."
fi

echo ""
echo "===== Existing UI Image History ====="

if [ -f "$HISTORY_FILE" ]; then
    nl -ba "$HISTORY_FILE"
else
    echo "History file does not exist yet."
fi

rm -f "$CANDIDATE_FILE"

add_candidate() {
    IMAGE="$1"

    [ -z "$IMAGE" ] && return 0
    [ "$IMAGE" = "$CURRENT_IMAGE" ] && return 0

    if ! grep -Fxq "$IMAGE" "$CANDIDATE_FILE" 2>/dev/null; then
        echo "$IMAGE" >> "$CANDIDATE_FILE"
    fi
}

# Always preserve the currently running UI image first.
add_candidate "$RUNNING_IMAGE"

# Then preserve previously recorded deployments.
if [ -f "$HISTORY_FILE" ]; then
    while IFS= read -r IMAGE
    do
        add_candidate "$IMAGE"
    done < "$HISTORY_FILE"
fi

echo ""
echo "===== Previous UI Images To Preserve ====="

if [ -s "$CANDIDATE_FILE" ]; then
    nl -ba "$CANDIDATE_FILE"
else
    echo "No previous UI images found."
fi

echo ""
echo "===== Restoring Missing Previous Images ====="

if [ -s "$CANDIDATE_FILE" ]; then
    while IFS= read -r IMAGE
    do
        [ -z "$IMAGE" ] && continue

        if docker image inspect "$IMAGE" >/dev/null 2>&1; then
            echo "Already available: $IMAGE"
        else
            echo "Not available locally. Trying Docker Hub: $IMAGE"

            if docker pull "$IMAGE"; then
                echo "Restored: $IMAGE"
            else
                echo "WARNING: $IMAGE is not available in Docker Hub."
                echo "It will not be added to the new history."
            fi
        fi
    done < "$CANDIDATE_FILE"
fi

echo ""
echo "===== Stopping Existing UI Deployment ====="

docker compose down --remove-orphans

echo ""
echo "===== Pulling Current UI Image ====="

IMAGE_NAME="$IMAGE_NAME" IMAGE_TAG="$IMAGE_TAG" docker compose pull

echo ""
echo "===== Starting Current UI Deployment ====="

IMAGE_NAME="$IMAGE_NAME" IMAGE_TAG="$IMAGE_TAG"     docker compose up -d --remove-orphans

echo ""
echo "===== Verifying Current UI Container ====="

DEPLOYED_IMAGE=$(docker inspect "$APP_NAME"     --format='{{.Config.Image}}' 2>/dev/null || true)

if [ "$DEPLOYED_IMAGE" != "$CURRENT_IMAGE" ]; then
    echo "ERROR: Expected $CURRENT_IMAGE"
    echo "       but running container has: ${DEPLOYED_IMAGE:-none}"
    exit 1
fi

echo "Running image confirmed: $DEPLOYED_IMAGE"

echo ""
echo "===== Updating UI Image History ====="

rm -f "$HISTORY_TMP"

# Current deployment is always first.
echo "$CURRENT_IMAGE" >> "$HISTORY_TMP"

# Keep the first two previous images that actually exist.
if [ -s "$CANDIDATE_FILE" ]; then
    while IFS= read -r IMAGE
    do
        [ -z "$IMAGE" ] && continue
        [ "$IMAGE" = "$CURRENT_IMAGE" ] && continue

        if docker image inspect "$IMAGE" >/dev/null 2>&1; then
            if ! grep -Fxq "$IMAGE" "$HISTORY_TMP"; then
                echo "$IMAGE" >> "$HISTORY_TMP"
            fi
        else
            echo "Skipping unavailable image: $IMAGE"
        fi

        if [ "$(wc -l < "$HISTORY_TMP")" -ge 3 ]; then
            break
        fi
    done < "$CANDIDATE_FILE"
fi

mv "$HISTORY_TMP" "$HISTORY_FILE"
rm -f "$CANDIDATE_FILE"

echo ""
echo "===== Final UI Image History ====="
nl -ba "$HISTORY_FILE"

echo ""
echo "===== New Containers ====="
docker compose ps

echo ""
echo "===== Deployment Completed Successfully ====="

'''

                    writeFile(
                        file: 'deploy-ayurvedaa-ui.sh',
                        text: deployScript
                    )

                    sh 'chmod +x deploy-ayurvedaa-ui.sh'

                    withCredentials([
                        usernamePassword(
                            credentialsId: "${SSH_CREDENTIALS}",
                            usernameVariable: 'SSH_USER',
                            passwordVariable: 'SSH_PASSWORD'
                        )
                    ]) {
                        sh '''
                            sshpass -p "$SSH_PASSWORD" scp                                 -o StrictHostKeyChecking=no                                 deploy-ayurvedaa-ui.sh                                 "$SSH_USER@$APP_SERVER:/tmp/deploy-ayurvedaa-ui.sh"

                            sshpass -p "$SSH_PASSWORD" ssh                                 -o StrictHostKeyChecking=no                                 "$SSH_USER@$APP_SERVER"                                 bash /tmp/deploy-ayurvedaa-ui.sh                                 "$DEPLOY_DIR"                                 "$IMAGE_NAME"                                 "$IMAGE_TAG"                                 "$BRANCH_NAME"                                 "$BUILD_NUMBER"                                 "$APP_NAME"

                            sshpass -p "$SSH_PASSWORD" ssh                                 -o StrictHostKeyChecking=no                                 "$SSH_USER@$APP_SERVER"                                 rm -f /tmp/deploy-ayurvedaa-ui.sh
                        '''
                    }

                    sh 'rm -f deploy-ayurvedaa-ui.sh'
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

                        sshpass -p "$SSH_PASSWORD" ssh                             -o StrictHostKeyChecking=no                             "$SSH_USER@$APP_SERVER"                             "cd $DEPLOY_DIR && docker compose ps"

                        echo "===== Nginx Configuration Test ====="

                        sshpass -p "$SSH_PASSWORD" ssh                             -o StrictHostKeyChecking=no                             "$SSH_USER@$APP_SERVER"                             "docker exec $APP_NAME nginx -t"

                        echo "===== HTTP Verification ====="

                        sshpass -p "$SSH_PASSWORD" ssh                             -o StrictHostKeyChecking=no                             "$SSH_USER@$APP_SERVER"                             "curl -f http://127.0.0.1:$APP_PORT/"

                        echo ""
                        echo "Ayurvedaa UI deployment verified successfully."
                    '''
                }
            }
        }

        // ==========================================================
        // APPLICATION SERVER CLEANUP
        //
        // Keep exactly the images recorded in history.
        // Normally this is current + previous 2.
        //
        // ONLY sunardock/ayurvedaa-ui images are touched.
        // No global docker image prune is used.
        // ==========================================================

        stage('Application Server Cleanup') {
            steps {
                script {
                    def cleanupScript = '''#!/bin/bash

set -e

APP_DIR="/root/ayurvedaa-ui"
IMAGE_NAME="sunardock/ayurvedaa-ui"
APP_NAME="ayurvedaa-ui"
HISTORY_FILE="${APP_DIR}/.ui-image-history"

echo "============================================"
echo "Ayurvedaa UI Image Cleanup"
echo "============================================"

if [ ! -f "$HISTORY_FILE" ]; then
    echo "ERROR: UI image history file is missing."
    echo "No UI images will be removed."
    exit 1
fi

RUNNING_IMAGE=$(docker inspect "$APP_NAME"     --format='{{.Config.Image}}' 2>/dev/null || true)

if [ -z "$RUNNING_IMAGE" ]; then
    echo "ERROR: Ayurvedaa UI container is not running."
    echo "No UI images will be removed."
    exit 1
fi

echo "Running UI image: $RUNNING_IMAGE"

if ! grep -Fxq "$RUNNING_IMAGE" "$HISTORY_FILE"; then
    echo "ERROR: Running image is not present in history."
    echo "No UI images will be removed."
    exit 1
fi

echo ""
echo "===== UI Image History ====="
nl -ba "$HISTORY_FILE"

echo ""
echo "===== UI Images Before Cleanup ====="
docker images "$IMAGE_NAME" --format '{{.Repository}}:{{.Tag}}'

echo ""
echo "===== Removing UI Images Not In History ====="

docker images "$IMAGE_NAME" --format '{{.Repository}}:{{.Tag}}' |
while IFS= read -r IMAGE
do
    [ -z "$IMAGE" ] && continue

    if grep -Fxq "$IMAGE" "$HISTORY_FILE"; then
        echo "KEEPING: $IMAGE"
    else
        echo "REMOVING: $IMAGE"
        docker image rm "$IMAGE" || true
    fi
done

echo ""
echo "===== Final UI Images ====="
docker images "$IMAGE_NAME"

echo ""
echo "===== Final UI Image History ====="
nl -ba "$HISTORY_FILE"

echo ""
echo "Application Server UI Cleanup Completed."

'''

                    writeFile(
                        file: 'cleanup-ayurvedaa-ui.sh',
                        text: cleanupScript
                    )

                    sh 'chmod +x cleanup-ayurvedaa-ui.sh'

                    withCredentials([
                        usernamePassword(
                            credentialsId: "${SSH_CREDENTIALS}",
                            usernameVariable: 'SSH_USER',
                            passwordVariable: 'SSH_PASSWORD'
                        )
                    ]) {
                        sh '''
                            sshpass -p "$SSH_PASSWORD" scp                                 -o StrictHostKeyChecking=no                                 cleanup-ayurvedaa-ui.sh                                 "$SSH_USER@$APP_SERVER:/tmp/cleanup-ayurvedaa-ui.sh"

                            sshpass -p "$SSH_PASSWORD" ssh                                 -o StrictHostKeyChecking=no                                 "$SSH_USER@$APP_SERVER"                                 bash /tmp/cleanup-ayurvedaa-ui.sh

                            sshpass -p "$SSH_PASSWORD" ssh                                 -o StrictHostKeyChecking=no                                 "$SSH_USER@$APP_SERVER"                                 rm -f /tmp/cleanup-ayurvedaa-ui.sh
                        '''
                    }

                    sh 'rm -f cleanup-ayurvedaa-ui.sh'
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

