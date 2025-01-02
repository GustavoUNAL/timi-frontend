import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../pagesStyles/index.module.css';
import { FaCog, FaPaperPlane } from 'react-icons/fa';


export default function Home() {
    const [currentDate, setCurrentDate] = useState('');
    const [inputText, setInputText] = useState('');

    useEffect(() => {
        const updateDate = () => {
            const now = new Date();
            const formattedDate = now.toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
            setCurrentDate(formattedDate);
        };
        updateDate();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
    };

    const handleRunClick = () => {
        // Aquí puedes implementar la lógica para ejecutar la entrada de texto
        console.log('Texto ingresado:', inputText);
        alert(`Ejecutando: ${inputText}`);
        setInputText(''); // Limpiar el input después de "ejecutar"
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <img
                    src="./images/timi.png"
                    alt="Logo de Timi"
                    className={styles.logo}
                />
               
            </div>

            <div className={styles.buttonContainer}>
            <Link href="/tasks">
                    <button className={styles.button}>
                         Tasks
                    </button>
                </Link>
         
               
            </div>
              <div className={styles.inputContainer}>
                    <input
                        type="text"
                        placeholder="Ingresa tu comando..."
                        value={inputText}
                        onChange={handleInputChange}
                        className={styles.inputField}
                    />
                    <button onClick={handleRunClick} className={styles.runButton}>
                       <FaPaperPlane  className={styles.sendIcon}/>
                    </button>
              </div>
            <div className={styles.dateDisplay}>{currentDate}</div>
            <Link href="/categories">
                    <FaCog className={styles.Ico} />
                </Link>
        </div>
    );
}