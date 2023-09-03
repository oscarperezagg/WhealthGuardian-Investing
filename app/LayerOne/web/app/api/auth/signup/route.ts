// Importar las dependencias necesarias
import { NextResponse } from 'next/server';
import User from '../../../../models/user'; // Importar el modelo de usuario
import { connect } from '../../../../lib/mongodb'; // Importar la función de conexión a MongoDB
import bcrypt from 'bcryptjs'; // Importar la biblioteca para el hashing de contraseñas

// Definir la función POST para manejar las solicitudes POST
export async function POST(request: Request) {
    // Obtener los datos del cuerpo de la solicitud
    const { fullname, email, password } = await request.json();

    // Validaciones de los datos recibidos
    if (!fullname) return NextResponse.json({ message: 'Full name must be included' }, { status: 400 });
    if (!email) return NextResponse.json({ message: 'Email must be included' }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ message: 'Password must be at least 8 characters long' }, { status: 400 });

    console.log(fullname, email, password);

    try {
        await connect(); // Establecer la conexión a MongoDB

        const userFound = await User.findOne({ email }); // Buscar un usuario existente por email

        if (userFound) return NextResponse.json({ message: 'Email already exists' }, { status: 409 });

        const hashedPassword = await bcrypt.hash(password, 12); // Hashear la contraseña

        // Crear un nuevo usuario con los datos proporcionados
        const user = new User({
            email,
            fullname,
            password: hashedPassword
        });

        const savedUser = await user.save(); // Guardar el usuario en la base de datos
     
        return NextResponse.json(savedUser);
    
    }
    catch (error) {
        console.log(error);

        // Manejar errores y retornar una respuesta adecuada
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
}
