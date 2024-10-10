import sql from 'mssql';

// Configuración de la base de datos MSSQL
const dbConfig = {
    server: "capstone-server-sql.database.windows.net",
    database: "Captone_DataBase",
    user: "SQLAdmin",
    password: "Capt0ne@2024#",
    options: {
        encrypt: true, // Habilita el cifrado
        trustServerCertificate: true // Acepta el certificado de servidor no confiable
    }
};

// Función para establecer la conexión
async function connectToDatabase() {
    try {
        // Conectar a la base de datos
        await sql.connect(dbConfig);
        console.log('Conexión a la base de datos establecida');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
}

// Exportar la conexión
export { sql, connectToDatabase };
