interface ApiResponse {
  message: string;
  data: null | any;
}

interface User {
  username: string;
  role: "USER" | "ADMIN";
}

interface TableApi {
  tableName: string;
  methods: ("GET" | "POST" | "DELETE")[];
  path: string;
}
