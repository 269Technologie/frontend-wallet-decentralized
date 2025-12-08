pipeline {
  agent any

  environment {
    REGISTRY             = "localhost:5151"
    IMAGE_NAME           = "frontend-wallet-decentralized"
    REGISTRY_IMAGE       = "${REGISTRY}/${IMAGE_NAME}"
    REGISTRY_CREDENTIALS = "registry-credentials"
    CONTAINER_NAME       = "frontend-wallet-decentralized"
    DOCKER_PORT          = "8022:8080"
  }

  stages {
    stage('Set Build Environment') {
      steps {
        script {
          def uniqueId = UUID.randomUUID().toString().replace("-", "").substring(0, 8)
          env.BUILD_MONTH  = new Date().format('MM')
          env.BUILD_DAY    = new Date().format('dd')
          env.BUILD_HOUR   = new Date().format('HH')
          env.BUILD_MINUTE = new Date().format('mm')
          env.VERSION = "${env.BUILD_NUMBER}-${env.BUILD_MONTH}.${env.BUILD_DAY}.${env.BUILD_HOUR}.${env.BUILD_MINUTE}-${uniqueId}"
        }
        echo "Build version: ${VERSION}"
      }
    }

    stage('Build Image') {
      steps {
        sh 'DOCKER_BUILDKIT=0 docker build -t ${REGISTRY_IMAGE}:${VERSION} .'
      }
    }

    stage('Push Image') {
      steps {
        script {
          docker.withRegistry("http://${REGISTRY}", REGISTRY_CREDENTIALS) {
            docker.image("${REGISTRY_IMAGE}:${VERSION}").push()
          }
        }
      }
    }

    stage('Deploy with Docker') {
      steps {
        script {
          echo "Ensuring docker network exists"
          sh 'docker network create wallet-network || true'

          echo "Stopping existing container (if present)"
          sh "docker stop ${CONTAINER_NAME} || true"
          sh "docker rm ${CONTAINER_NAME} || true"

          echo "🚀 Starting new container"
          sh """
            docker run -d --name ${CONTAINER_NAME} \\
              -p ${DOCKER_PORT} \\
              --network wallet-network \\
              ${REGISTRY_IMAGE}:${VERSION}
          """
          
          echo "✅ Container deployed at http://localhost:8022"
        }
      }
    }
  }

  post {
    always {
      echo "🧼 Cleanup local image"
      sh "docker rmi -f ${REGISTRY_IMAGE}:${VERSION} || true"
      cleanWs()
    }
  }
}
