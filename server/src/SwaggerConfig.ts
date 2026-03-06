import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Restaurnat Review Project API",
            version: "1.0.0",
            description: "API documentation for the Restaurnat Review Project",
        },
    },
    apis: ["./src/swagger/*.yaml"], // Files containing annotations or YAML documents
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
export default swaggerSpec;
