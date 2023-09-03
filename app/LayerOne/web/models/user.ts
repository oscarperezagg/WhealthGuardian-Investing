// Importar el módulo Schema y model desde mongoose para definir esquemas de datos y crear modelos
import { Schema, model, models } from 'mongoose';

// Definir un esquema llamado UserSchema para representar la estructura de un usuario
const UserSchema = new Schema({
    email: {
        type: String,                    // Tipo de dato: String (cadena de texto)
        required: true,                  // Campo requerido en el esquema
        unique: true,                    // Valor único en el esquema
        match: [                         // Validar el formato de correo electrónico usando una expresión regular
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 
            'Please fill a valid email address'
        ]
    },
    password: {
        type: String,                    // Tipo de dato: String (cadena de texto)
        required: [true, 'Please add a password'], // Campo requerido con mensaje personalizado si no se proporciona
        select: false,                   // No seleccionar automáticamente este campo en las consultas
        minlength: 8                     // Longitud mínima de la contraseña
    },
    fullname: {
        type: String,                    // Tipo de dato: String (cadena de texto)
        required: [true, 'Please add a name'], // Campo requerido con mensaje personalizado si no se proporciona
        select: false,    
        maxlength: 50                    // Longitud máxima del nombre completo
    },
});

// Verificar si el modelo "User" ya existe en los modelos de mongoose, de lo contrario, crearlo
const User = models.User || model('User', UserSchema);

// Exportar el modelo User para que pueda ser utilizado en otras partes de la aplicación
export default User;
