# 📦 Bien copiado — Instrucciones de instalación y desarrollo
Este proyecto está desarrollado con **Strapi**, e incluye un conjunto de **plugins personalizados** ubicados en la carpeta `src/plugins`.

## 🚀 Instalación del proyecto
 1️⃣ Clonar el repositorio
```
git clone https://github.com/jissust/headless-cms.git
cd headless-cms
```

2️⃣ Instalar dependencias
Instala todas las dependencias necesarias y genera la carpeta node_modules:
```
yarn install
```

3️⃣ Generar archivo de entorno
Crea el archivo .env a partir del archivo de ejemplo:
```
cp .env.example .env
```

4️⃣ Compilar el proyecto
Genera la carpeta /dist con los archivos de compilación de Strapi [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build):
```
yarn build
```

5️⃣ Iniciar el entorno de desarrollo
Ejecuta el proyecto en modo desarrollo.
Esto creará automáticamente el archivo /tmp/.data.db (base de datos local) y levantará el servidor. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)
```
yarn dev
```

El proyecto estará disponible, por defecto, en:
👉 http://localhost:1337/admin

## 🧩 Plugins personalizados
Este proyecto incluye plugins desarrollados específicamente para funcionalidades personalizadas de Strapi.

📁 Ubicación
```
src/plugins/my-custom-fields/
```

⚙️ Compilar un plugin personalizado
Cada vez que realices cambios en un plugin, debés compilarlo antes de ejecutarlo:
```
cd src/plugins/my-custom-fields
yarn build
```
## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```
yarn strapi deploy
```

## 📤 Subir plugins al repositorio
Por defecto, la carpeta /dist generada dentro de un plugin no se incluye en Git.
Para versionar los cambios y subirlos al repositorio, debés forzar la inclusión de la carpeta dist:
```
git add -f src/plugins/my-custom-fields/dist
git commit -m "Actualización del plugin my-custom-fields"
git push
```
Luego podés continuar con el flujo normal de versionado (git commit, git push, etc.).

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
