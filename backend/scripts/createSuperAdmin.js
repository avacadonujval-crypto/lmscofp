import dotenv from 'dotenv';
import sequelize from '../config/db.js';
import { User } from '../models/index.js';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createSuperAdmin = async () => {
    try {
        console.log('\n=== Super Admin Account Creation ===\n');

        // Connect to database
        await sequelize.authenticate();
        console.log('✓ Database connected\n');

        // Sync models
        await sequelize.sync({ alter: true });

        // Check if super admin already exists
        const existingSuperAdmin = await User.findOne({ where: { role: 'superadmin' } });

        if (existingSuperAdmin) {
            console.log('⚠ A super admin account already exists!');
            console.log(`Email: ${existingSuperAdmin.email}\n`);

            const overwrite = await question('Do you want to create another super admin? (yes/no): ');
            if (overwrite.toLowerCase() !== 'yes') {
                console.log('\nOperation cancelled.');
                rl.close();
                process.exit(0);
            }
        }

        // Get super admin details
        const name = await question('Enter super admin name: ');
        const email = await question('Enter super admin email: ');
        const password = await question('Enter super admin password: ');

        // Validate inputs
        if (!name || !email || !password) {
            console.log('\n❌ All fields are required!');
            rl.close();
            process.exit(1);
        }

        // Check if email already exists
        const emailExists = await User.findOne({ where: { email } });
        if (emailExists) {
            console.log('\n❌ A user with this email already exists!');
            rl.close();
            process.exit(1);
        }

        // Create super admin
        const superAdmin = await User.create({
            name,
            email,
            password, // Will be hashed by the model hook
            role: 'superadmin',
            status: 'Active'
        });

        console.log('\n✓ Super admin account created successfully!');
        console.log(`\nLogin credentials:`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log(`\nYou can now login at: http://localhost:3000/superadmin-login\n`);

        rl.close();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error creating super admin:', error.message);
        rl.close();
        process.exit(1);
    }
};

createSuperAdmin();
