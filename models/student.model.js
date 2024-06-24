module.exports = (sequelize_config, Sequelize) => {
    const Student = sequelize_config.define('student', {
        student_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        first_name: { 
            type: Sequelize.STRING, 
            allowNull: false 
        },
        last_name: { 
            type: Sequelize.STRING, 
            allowNull: false 
        },
        class: { 
            type: Sequelize.STRING 
        },
        age: {
            type: Sequelize.INTEGER,
            validate: {
                min: 10
            }
        },
        parent_phone_number: {
            type: Sequelize.STRING,
            validate: {
                is: /^\+256\d{9}$/ // regex to match +256 followed by 9 digits
            }
        },
        gender: {
            type: Sequelize.ENUM('M', 'F')
        },
        physical_address: {
            type: Sequelize.STRING,
            defaultValue: 'Kampala'
        },
        category: {
            type: Sequelize.ENUM('DAY', 'BOARDING')
        },
        status: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    }, {
        defaultScope: {
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'student_id']
            }
        }
    });

    return Student;
}
