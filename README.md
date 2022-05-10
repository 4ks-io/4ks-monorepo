Getting starter

```
minikube start

tilt up

minikube dashboard

docker-compose up
```

<!-- https://kubernetes.io/docs/concepts/cluster-administration/manage-deployment/ -->

The resources will be created in the order they appear in the file. Therefore, it's best to specify the service first, since that will ensure the scheduler can spread the pods associated with the service as they are created by the controller(s), such as Deployment.
