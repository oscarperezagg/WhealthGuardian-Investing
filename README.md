# WhealthGuardian-Investing
## Plataforma de Inversión
### Descripción del Proyecto:

La "Plataforma de Inversión - WhealthGuardian Investing Platform" revoluciona la inversión al proporcionar herramientas esenciales para inversores, como indicadores personalizados, datos fundamentales, backtesting, gestión integral de inversiones, diversificación y reportes detallados.

### Desarrollo Tecnológico:

Para dar vida a esta plataforma innovadora, se emplearán varios lenguajes de programación, como Python, C y Yaml. También se integrarán API externas para mejorar las fuentes de datos y la funcionalidad. Los datos se almacenarán en bases de datos no relacionales para eficiencia y escalabilidad. Además, se ofrecerá una interfaz web intuitiva y accesible para los usuarios desde cualquier dispositivo, a través de un sistema de microservicios.

### Objetivo Principal:

El enfoque principal del Trabajo de Final de Grado será desarrollar un MVP con la funcionalidad de backtesting. Esta función permitirá configurar estrategias basadas en datos cuantitativos para evaluar su efectividad. Además de esta función, se añadirán capacidades para diversificar inversiones y generar reportes detallados sobre el rendimiento de las estrategias.

Aunque las funcionalidades más avanzadas como datos fundamentales y tecnologías como IA o machine learning son prometedoras, no serán abordadas en esta etapa académica. El backtesting y las nuevas funcionalidades facilitarán a los inversores evaluar la viabilidad de sus estrategias y tomar decisiones informadas, fomentando la confianza en sus inversiones. Con este proyecto, buscamos proporcionar una herramienta valiosa para la comunidad inversora, simplificando la evaluación y perfeccionamiento de estrategias de inversión.

### Repositorio

Este repositorio almacena todo el proyecto de tres niveles con microservicios. Para trabajar en una carpeta individual o un microservicio específico, se pueden usar los siguientes comandos:

```git clone --depth=1 --filter=blob:none --sparse https://github.com/oscarperezagg/WhealthGuardian-Investing
cd WhealthGuardian-Investing
git sparse-checkout init --cone
git sparse-checkout set app/layerOne
```

Este comando clonará el repositorio en una nueva carpeta en el equipo y establecerá el modo sparse de git. Luego, el comando ```git sparse-checkout set app/layerOne``` establecerá la carpeta ```app/layerOne``` como la única carpeta que se descargará.

De esta manera, solo se descargarán los archivos de la carpeta ```app/layerOne```. Los archivos de las demás carpetas no se descargarán.

El mismo proceso se puede aplicar para descargar un microservicio específico. Por ejemplo, para descargar el microservicio de reporting, se pueden usar los siguientes comandos:

```git clone --depth=1 --filter=blob:none --sparse https://github.com/oscarperezagg/WhealthGuardian-Investing
cd WhealthGuardian-Investing
git sparse-checkout init --cone
git sparse-checkout set app/layerTwo/reporting
```

Estos comandos descargarán solo los archivos de la carpeta ```app/layerTwo/reporting```.



**Advisory:**
Ten en cuenta que las tecnologías utilizadas, el enfoque del proyecto y todo lo redactado en la descripción están sujetos a cambios. Para obtener una descripción actualizada sobre el desarrollo del proyecto, te invitamos a visitar la página [aquí](https://oscarperezarruti.notion.site/WealthGuardian-Investing-e354853e8cbd40a2910a6f6146fa5a86?pvs=4).
