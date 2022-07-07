import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());

	// Swagger doc
	const config = new DocumentBuilder()
		.setTitle('FeedBack API')
		.setVersion('0.1')
		.setLicense('MIT License', 'https://github.com/kravchuk21/FeedBack/blob/master/LICENSE')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('/', app, document);

	app.setGlobalPrefix('api');
	await app.listen(3000);
}

bootstrap();
