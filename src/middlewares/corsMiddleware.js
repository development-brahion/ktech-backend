import cors from "cors";

const getCorsOrigins = () => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
  const allowThirdParty = process.env.ALLOW_THIRD_PARTY_API_CLIENTS === "true";

  if (allowThirdParty) {
    allowedOrigins.push("http://localhost");
  }

  return allowedOrigins;
};

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = getCorsOrigins();
    const allowThirdParty =
      process.env.ALLOW_THIRD_PARTY_API_CLIENTS === "true";

    // Allow server-to-server / Postman
    if (!origin) {
      return allowThirdParty
        ? callback(null, true)
        : callback(new Error("CORS: Origin not allowed"));
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS: ${origin} not allowed`));
  },

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};


const corsMiddleware = () => cors(corsOptions);

export default corsMiddleware;
