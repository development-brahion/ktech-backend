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

    if (!origin) {
      if (allowThirdParty) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const corsMiddleware = () => cors(corsOptions);

export default corsMiddleware;
