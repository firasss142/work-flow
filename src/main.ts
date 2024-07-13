import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as express from "express";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  const options = new DocumentBuilder()
    .setTitle("TrustId API")
    .setDescription("TrustId API")
    .addBearerAuth()
    .setVersion("1.0")
    .addTag("API")
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api/docs", app, document);
  await app.listen(3002);
}
bootstrap();
