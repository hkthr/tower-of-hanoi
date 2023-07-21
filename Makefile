CLIENT_DIR=.
CLIENT_INIT_TARGET_DIR=${CLIENT_DIR}/node_modules
CLIENT_BUILD_DIR=${CLIENT_DIR}/build
CLIENT_BUILD_TARGET_FILE=${CLIENT_BUILD_DIR}/index.html
CLIENT_SRC=${CLIENT_DIR}/public/*.* ${CLIENT_DIR}/src/*.* ${CLIENT_DIR}/src/components/*.*
PORT=18080
DOCKER_PORT=80

SERVER_BIN_NAME=hanoi
REPO_NAME=hkthr
DOCKER_FILE=Dockerfile
DOCKER_IMAGE_REPO=${REPO_NAME}/${SERVER_BIN_NAME}

all: build

# clean
clean: 
	rm -rf ${CLIENT_DIR}/node_modules
	rm -rf ${CLIENT_BUILD_DIR}

# init
init: ${CLIENT_INIT_TARGET_DIR}

${CLIENT_INIT_TARGET_DIR}:
	@echo "> Installing the client dependencies ..."
	@cd ${CLIENT_DIR}&&npm install -D --unsafe-perm

# build
build: init ${CLIENT_BUILD_TARGET_FILE}

${CLIENT_BUILD_TARGET_FILE}: ${CLIENT_SRC}
	@echo "> Building the client ..."
	cd ${CLIENT_DIR}&&npm run build

# test
test: build
	@echo "> Running client test..."
	@cd ${CLIENT_DIR}&&CI=true npm run test

testv: build
	@echo "> Running client test (verbose output)..."
	@cd ${CLIENT_DIR}&&CI=true npm run test -- --verbose

# run
run: build
	@echo "> Running Frontend ..."
	@cd ${CLIENT_DIR}&&npm start

docker: build
	@echo "> Build docker container ..."
	@docker build -t ${DOCKER_IMAGE_REPO} -f ${DOCKER_FILE} --no-cache .

docker-run: 
	@echo "> Run docker container on port:${PORT}"
	@echo "> Press Ctrl+C to stop the container... "
	@docker run -it -p ${PORT}:${DOCKER_PORT} --rm ${DOCKER_IMAGE_REPO}

.PHONY: all build clean init test testv test-client test-clientv run docker docker-run
