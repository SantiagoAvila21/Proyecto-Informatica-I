# 🎨 ColorApp — Persistencia con DynamoDB

> Proyecto I · Informática
> **Autor:** Santiago Avila — 20201020065

🔗 **Documentación:** [https://SantiagoAvila21.github.io/Proyecto-Informatica-I/](https://SantiagoAvila21.github.io/Proyecto-Informatica-I/)

Aplicación web en **Spring Boot** que genera colores aleatorios y saluda al usuario, con **persistencia en AWS DynamoDB**: cada saludo queda guardado y se puede consultar el historial.

---

## 🚀 Descripción

ColorApp es una app sencilla que, al entrar, muestra un color hexadecimal aleatorio y pinta el fondo con él. El usuario puede escribir su nombre para recibir un saludo; ese saludo (junto con el color generado y la fecha) se **persiste en una tabla de DynamoDB** y se visualiza en un panel lateral con el historial.

## 🧰 Tecnologías

- Java 25
- Spring Boot 4.1.1 (Web MVC + Thymeleaf)
- AWS SDK for Java v2 (`dynamodb-enhanced`)
- Amazon DynamoDB
- systemd / Proxmox (despliegue)
- HTTPS con keystore PKCS12

## ✨ Funcionalidades

- Generación de color hexadecimal aleatorio como fondo de página
- Copiar el código del color al portapapeles
- Endpoint `POST /saludar` que saluda y persiste el saludo en DynamoDB
- Endpoint `GET /historial` que devuelve todos los saludos guardados
- Panel lateral "Historial de Saludos" en la interfaz

## 🔌 Endpoints

| Método | Ruta        | Descripción                             |
|--------|-------------|-----------------------------------------|
| GET    | `/`         | Página HTML con un color aleatorio      |
| GET    | `/color`    | Devuelve un color aleatorio en JSON     |
| POST   | `/saludar`  | Recibe `{ "nombre": "..." }` y persiste |
| GET    | `/historial`| Lista todos los saludos persistidos     |

## 🏗️ Arquitectura

```
Navegador ──► Spring Boot (8443 HTTPS) ──► DynamoDB (tabla colorapp-saludos)
```

Flujo de persistencia:

1. `Saludo` es la entidad mapeada con `@DynamoDbBean`.
2. `DynamoDbConfig` construye los clientes de AWS (región y tabla desde `application.properties`).
3. `SaludoRepository` abstrae `putItem` (guardar) y `scan` (listar).
4. `ColorController` persiste cada saludo y expone `/historial`.

## 📁 Estructura

```
ColorApp/
├── src/main/java/com/example/colorapi/
│   ├── ColorAppApplication.java
│   ├── ColorController.java
│   ├── Saludo.java
│   ├── SaludoRepository.java
│   ├── DynamoDbConfig.java
│   ├── NombreRequest.java
│   └── GlobalExceptionHandler.java
├── src/main/resources/
│   ├── application.properties
│   ├── keystore.p12
│   ├── templates/ (color.html)
│   └── static/ (style.css, script.js)
├── docs/            ← documentación (GitHub Pages)
└── pom.xml
```

## ⚙️ Requisitos

- JDK 25
- Maven (o `./mvnw`)
- Cuenta AWS con una tabla DynamoDB y credenciales (Access Key / Secret)

## ▶️ Ejecutar localmente

```bash
./mvnw spring-boot:run
```

Configurar en `application.properties`:

```properties
aws.region=us-east-1
aws.dynamodb.table=colorapp-saludos
```

Credenciales por variables de entorno:

```bash
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
```

Acceder en: `https://localhost:8443/`

## 🖥️ Despliegue en Proxmox

1. Compilar: `./mvnw clean package`
2. Copiar el `.jar` a `/opt/colorapi`
3. Crear el servicio systemd (`colorapp.service`) con `EnvironmentFile=/etc/colorapp.env`
4. `sudo systemctl enable --now colorapp`

## 📚 Documentación

La documentación completa del proceso está disponible en:

🔗 [https://SantiagoAvila21.github.io/Proyecto-Informatica-I/](https://SantiagoAvila21.github.io/Proyecto-Informatica-I/)

---

> Hecho por **Santiago Avila** — 20201020065
