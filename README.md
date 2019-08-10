# Commands:

Replace the auto-generated resource names in the example with actual ones.
Check `kubectl get [pods|services|deployments]`

```sh
# install helm
kubectl apply -f rbac-helm-config.yml
# init helm
helm init --service-account tiller --history-max 200
# install prometheus with helm
helm install stable/prometheus-operator

cat alertmanager.yaml | base64 | pbcopy
# replace alertmanager secret to send messages to slack with a custom template
kubectl edit secret alertmanager-sad-wolf-prometheus-operat-alertmanager

# create sample microservice services
kubectl create -f info-service.yml users-service.yml api-gateway-service.yml
kubectl create -f info-app-deployment.yml users-app-deployment.yml api-gateway-app-deployment.yml

# port-forwards to access prometheus, grafana, alertmanager
kubectl port-forward svc/sad-wolf-prometheus-operat-prometheus 9090:9090
kubectl port-forward svc/sad-wolf-grafana 8080:80
kubectl port-forward svc/sad-wolf-prometheus-operat-alertmanager 9093:9093
kubectl port-forward svc/api-gateway 3000:80

# put some load on the service
ab -t 500 -c 100 -H "Authorization: s4mpl3t0k3n" localhost:3000/api/v1/info

```

# To run on localhost

Follow the instructions in the previous block, but before creating services, do the following:

```sh
eval $(minikube docker-env)
docker build -t YOUR_IMAGE_NAME:v1 ./microservices-example/SERVICE_NAME
```

Edit your `*-app-deployment.yaml` files according to the image names you used, then use `kubectl create -f FILENAME` to create deployments

To get the default admin password for grafana run
```sh
kubectl get secret NAME_OF_YOUR_GRAFANA -o jsonpath="{.data.admin-password}" | base64 --decode ; echo
```

# Example requests:

```sh
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username":"Eve","password":"Eve"}' \
  http://localhost:3000/api/v1/login
curl -X POST localhost:3000/api/v1/login
curl -H "Authorization: s4mpl3t0k3n" localhost:3000/api/v1/info
curl localhost:3000/api/v1/info
curl -H "Authorization: s4mpl3t0k3n" localhost:3000/api/v1/users
curl localhost:3000/api/v1/users
```
