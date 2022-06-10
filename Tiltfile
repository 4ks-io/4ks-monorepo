
# https://docs.tilt.dev/api.html#api.version_settings
version_settings(constraint='>=0.22.2')

# https://docs.tilt.dev/api.html#api.docker_build
# https://docs.tilt.dev/live_update_reference.html
docker_build(
    '4ks-api',
    context='.',
    dockerfile='./apps/api/Dockerfile.dev',
    only=['./apps/api', './go.mod', './go.sum', './libs/go'],
    live_update=[
        sync('./apps/api/', '/app/apps/api'),
        sync('./libs/go/', '/app/libs/go'),
        run(
            'go mod tidy',
            trigger=['./apps/api/']
        )
    ]
)

docker_build(
    '4ks-web',
    context='.',
    dockerfile='./apps/web/Dockerfile.dev',
    only=[],
    ignore=['./dist', './node_modules'],
    live_update=[
        fall_back_on('./apps/web/vite.config.ts'),
        sync('./', '/app/'),
        sync('./libs/ts/api-fetch/dist', '/app/libs/ts/api-fetch/dist'),
        run(
            'pnpm install',
            trigger=['./package.json', './apps/web/package.json']
        )
    ]
)

# https://docs.tilt.dev/api.html#api.k8s_yaml
k8s_yaml(['./deploy/api.yaml', './deploy/web.yaml', './deploy/firestore.yaml', './deploy/jaeger.yaml'])

# https://docs.tilt.dev/api.html#api.k8s_resource
k8s_resource(
    'api',
    port_forwards='0.0.0.0:5734:5000',
    labels=['backend']
)

k8s_resource(
    'web',
    port_forwards='0.0.0.0:5735:3000',
    labels=['web']
)

k8s_resource(
    'firestore',
    port_forwards='8200:8200',
    labels=['firestore','database']
)

k8s_resource(
    'jaeger',
    port_forwards=['9411:9411','5775:5775','6831:6831','6832:6832','5778:5778','16686:16686','14250:14250','14268:14268','14269:14269'],
    labels=['database']
)

# config.main_path is the absolute path to the Tiltfile being run
# https://docs.tilt.dev/api.html#modules.config.main_path
tiltfile_path = config.main_path

# https://github.com/bazelbuild/starlark/blob/master/spec.md#print
print("""
Starting 4ks Services
""".format(tiltfile=tiltfile_path))
