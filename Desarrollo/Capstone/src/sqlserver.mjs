import { getConnetions, mssql } from "../database/connectionSQLServer.js";

const getproducts =async () => {
    try {
        const pool = await getConnetions();
        const result = await pool.request().query("Select * from ciudad");
        console.table(result.recordset);
        console.log("Ciudades");      
    } catch (error){
        console.error(error);
    }
};

getproducts();