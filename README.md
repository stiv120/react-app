# Acerca del proyecto

El proyecto es una app hecha con React.js para el frontend que consume una API de OpenWheater para mostrar la humedad de las ciudades que el usuario seleccione, a su vez se muestra la ciudad seleccionada en un mapa mediante la librería leaflet, se almacena un historial de consultas en una base de datos MySQL mediante una API hecha en PHP como backend.

# Iniciar proyecto react-app con PHP

En la raíz o en dónde se descomprima el archivo cuando se descargue el código, ingresa al directorio mediante el siguiente comando.

```sh
cd react-app
```

Dentro del proyecto, primero instalaremos las dependencias añadidas en el package json mediante el siguiente comando:

### `npm i`

Instala el node_modules con las dependencias necesarias para la aplicación. <br>

## Conectar a la base de datos.

La base de datos fue creada en MYSQL y montada de manera local en un servidor apache que proporciona el xampp, para poder que funcione primero tenemos que tener instalado xampp y seguir los siguientes pasos.<br />

1. Copiar y pegar los archivos del directorio api en dónde se encuentra la lógica PHP de nuestro proyecto, en dónde se encuentre instalado el xampp en la carpeta htdocs.

2. Después tenemos que ejecutar el script que se encuentra en la siguiente ruta del proyecto: api/esquema.sql en una hoja de SQL dentro de PHPMyAdmin, si todo sale sin errores ya tendríamos la conexión a la base de datos.

## Iniciar aplicación

Dentro del proyecto, puede ejecutar algunos comandos incorporados:

### `npm start` or `yarn start`
Ejecuta la aplicación en modo de desarrollo.
Abre http://localhost:3000 para verla en el navegador.

La página se recargará automáticamente si realizas cambios en el código.
Verás los errores de compilación y las advertencias de lint en la consola.

### `npm test` or `yarn test`

Ejecuta el observador de pruebas en modo interactivo.<br>
Por defecto, ejecuta las pruebas relacionadas con los archivos modificados desde la última confirmación.

[Más información sobre las pruebas](https://facebook.github.io/create-react-app/docs/running-tests)

### `npm run build` or `yarn build`

Crea la aplicación para producción en la carpeta `build`.<br>
Empaqueta correctamente React en modo de producción y optimiza la compilación para obtener el mejor rendimiento.

La compilación se minimiza y los nombres de archivo incluyen los hashes.<br>

Su aplicación está lista para ser implementada.