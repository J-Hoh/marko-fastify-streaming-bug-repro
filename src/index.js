import path from "path"

import fastify from "fastify"
import fastifyStatic from "fastify-static"
import fastifyCompress from "fastify-compress"
import fastifyMarko from "@marko/fastify"

import express from "express"
import expressCompress from "compression"
import expressMarko from "@marko/express"

import template from "./template.marko"

const port = process.env.PORT ?? 8080;

switch(process.env.SERVER_TYPE){
	default:
	case "fastify": {
		const server = fastify()
			.register(fastifyCompress)
			.register(fastifyStatic, {
				root: path.resolve("dist/assets"),
				prefix: "/assets",
			});
		switch(process.env.STREAMMODE){
			default:
			case "old":
				server.register(fastifyMarko)
				server.get("/", async (_request, response)=>{
					await response.marko(template, { renderingServer: "fastify-old" });
				})
				break;
			case "fixed": // Proposed change:
				server.get("/", async (_request, response)=>{
					response.type("text/html; charset=utf-8");
					template.stream({ renderingServer: "fastify-fixed" }).pipe(response.raw);
				});
				break;
		}
		server.listen(port, (err, address) => {
			if(err)
				throw err;
			if(port !== "0")
				console.log(`Fastify listening on port ${address}`);
		});
		break;
	}
	case "express":
		express()
			.use(expressCompress())
			.use("/assets", express.static("dist/assets"))
			.use(expressMarko())
			.get("/", (_request, response) => {
				response.marko(template, { renderingServer: "express" });
			})
			.listen(port, err => {
				if(err)
					throw err;
				if(port)
					console.log(`Express listening on port ${port}`);
			});
	break;
}
