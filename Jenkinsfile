    fi
done
echo ""
echo "===== Final UI Images ====="
docker images "$IMAGE_NAME"
echo ""
echo "===== Final UI Deployment History ====="
nl -ba "$HISTORY_FILE"
echo ""
echo "============================================"
echo "Application Server UI Cleanup Completed"
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
                            sshpass -p "$SSH_PASSWORD" scp                                 -o StrictHostKeyChecking=no                                 cleanup-ayurvedaa-ui.sh                                 "$SSH_USER@$APP_SERVER:/tmp/cleanup-ayurvedaa-ui.sh"
                            echo "===== Execute Cleanup Script ====="
                            sshpass -p "$SSH_PASSWORD" ssh                                 -o StrictHostKeyChecking=no                                 "$SSH_USER@$APP_SERVER"                                 bash /tmp/cleanup-ayurvedaa-ui.sh
                            echo "===== Remove Remote Cleanup Script ====="
                            sshpass -p "$SSH_PASSWORD" ssh                                 -o StrictHostKeyChecking=no                                 "$SSH_USER@$APP_SERVER"                                 rm -f /tmp/cleanup-ayurvedaa-ui.sh
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
            echo '''
============================================
AYURVEDAA UI DEPLOYMENT SUCCESSFUL
============================================
Branch       : ${env.BRANCH_NAME}
Build        : ${env.BUILD_NUMBER}
Docker Image : ${env.IMAGE_NAME}:${env.IMAGE_TAG}
Server       : ${env.APP_SERVER}
Port         : ${env.APP_PORT}
============================================
'''
        }
        failure {
            echo '''
============================================
AYURVEDAA UI DEPLOYMENT FAILED
============================================
Branch : ${env.BRANCH_NAME}
Build  : ${env.BUILD_NUMBER}
Check the failed Jenkins stage.
============================================
'''
        }
        always {
            echo "Cleaning Jenkins workspace..."
            cleanWs()
        }
    }
}
