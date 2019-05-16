# Commands:

```sh
# install helm
$ kubectl apply -f rbac-helm-config.yml
# init helm
$ helm init --service-account tiller --history-max 200
# install prometheus with helm
$ helm install stable/prometheus-operator

$ cat alertmanager.yaml | base64 | pbcopy
# replace alertmanager secret to send messages to slack with a custom template
$ kubectl edit secret alertmanager-sad-wolf-prometheus-operat-alertmanager

# create sample microservice services
$ kubectl create -f info-service.yml users-service.yml api-gateway-service.yml
$ kubectl create -f info-app-deployment.yml users-app-deployment.yml api-gateway-app-deployment.yml

# port-forwards to access prometheus, grafana, alertmanager
$ kubectl port-forward svc/sad-wolf-prometheus-operat-prometheus 9090:9090
$ kubectl port-forward svc/sad-wolf-grafana 8080:80
$ kubectl port-forward svc/sad-wolf-prometheus-operat-alertmanager 9093:9093
$ kubectl port-forward svc/api-gateway 3000:80

# put some load on the service
$ ab -t 500 -c 100 -H "Authorization: s4mpl3t0k3n" localhost:3000/api/v1/info
```

# Example requests:

```sh
$ curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username":"Eve","password":"Eve"}' \
  http://localhost:3000/api/v1/login
$ curl -X POST localhost:3000/api/v1/login
$ curl -H "Authorization: s4mpl3t0k3n" localhost:3000/api/v1/info
$ curl localhost:3000/api/v1/info
$ curl -H "Authorization: s4mpl3t0k3n" localhost:3000/api/v1/users
$ curl localhost:3000/api/v1/users
```
