import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: [/^(.*)/],
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		preflightContinue: false,
		optionsSuccessStatus: 200,
		credentials: true,
		allowedHeaders:
			'Origin,X-Requested-With,Content-Type,Accept,Authorization,authorization,X-Forwarded-for'
	});


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
	await app.listen(process.env.PORT || 7777);
}

bootstrap();
