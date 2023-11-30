# https://docs.tilt.dev/api.html#api.version_settings
version_settings(constraint='>=0.22.2')

local_resource(
    'package_json',
    cmd='./tools/package_json.sh',
    deps=['pnpm-lock.yaml']
)

# resources
k8s_yaml([
    'deploy/api.yaml',
    'deploy/web.yaml',
    'deploy/fetcher.yaml',
    'deploy/firestore.yaml',
    'deploy/typesense.yaml',
    'deploy/pubsub.yaml',
    # 'deploy/jaeger.yaml'
])

# api
k8s_resource('api', port_forwards='0.0.0.0:5734:5000',labels=['backend'])
docker_build(
    '4ks-api',
    context='.',
    dockerfile='apps/api/Dockerfile.dev',
    only=[
        'apps/api',
        'go.mod',
        'go.sum',
        'libs/go',
        'libs/reserved-words',
        'deploy/sbx-4ks-google-app-creds.json'
    ],
    live_update=[
        sync('apps/api/', '/code/apps/api'),
        sync('libs/go/', '/code/libs/go'),
        run(
            'go mod tidy',
            trigger=['apps/api/']
        )
    ]
)


# recipe-fetcher
# k8s_resource('fetcher', port_forwards='0.0.0.0:5737:5000',labels=['backend'])
docker_build(
    'fetcher',
    context='.',
    dockerfile='apps/recipe-fetcher/Dockerfile.dev',
    only=[
        'apps/recipe-fetcher',
        'go.mod',
        'go.sum',
        'libs/go',
    ],
    live_update=[
        sync('apps/recipe-fetcher/', '/code/apps/recipe-fetcher'),
        sync('libs/go/', '/code/libs/go'),
        run(
            'go mod tidy',
            trigger=['apps/recipe-fetcher/']
        )
    ]
)

# web
k8s_resource('web', port_forwards='0.0.0.0:5736:3000', labels=['web','next'])
docker_build(
    'web',
    context='.',
    dockerfile='apps/web/Dockerfile.dev',
    # todo: make only
    ignore=[
        'ignore',
        'apps/media-upload',
        'apps/recipe-fetcher',
        'apps/api',
        'apps-dev',
        'libs/go',
        'data',
        'deploy',
        'dist',
        'node_modules',
        'publish',
        'tools',
        'go*'
    ],
    live_update=[
        sync('libs/ts/api-fetch/dist', '/code/libs/ts/api-fetch/dist'),
        sync('apps/web', '/code/apps/web'),
        run(
            'pnpm install',
            trigger=['package.json', 'apps/web/package.json']
        )
    ]
)

# more
# k8s_resource('pubsub',    port_forwards='8085:8085', labels=['database','pubsub'])
k8s_resource('typesense', port_forwards='0.0.0.0:8108:8108', labels=['database','typesense'])
# k8s_resource('firestore', port_forwards='8200:8200', labels=['database','firestore'])
# k8s_resource( 'jaeger', port_forwards=['9411:9411','5775:5775','6831:6831','6832:6832','5778:5778','16686:16686','14250:14250','14268:14268','14269:14269'], labels=['jaeger'])

# config.main_path is the absolute path to the Tiltfile being run
# https://docs.tilt.dev/api.html#modules.config.main_path
tiltfile_path = config.main_path

# https://github.com/bazelbuild/starlark/blob/master/spec.md#print
print("""
Starting 4ks Services
""".format(tiltfile=tiltfile_path))
