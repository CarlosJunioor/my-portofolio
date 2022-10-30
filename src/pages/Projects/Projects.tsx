import { useEffect, useState } from 'react'

import Card from './components/Card.tsx';

function Projects() {
    const [ repo, setRepo ] = useState([])

    useEffect(() => {
        fetch('https://api.github.com/users/CarlosJunioor/repos')
        .then(response => response.json())
        .then(data => setRepo(data))
    }, [])

    return (
        <>
        <Card />

        <h2>Small Projects</h2>

        <ul>
            { repo.map(repo => {
                return (
                    <li>
                        <h3>
                            {repo.name}
                        </h3>
                        <p>
                            {repo.description}
                        </p>
                        <a href={repo.html_url} target='_blank'>- Link </a>
                    </li>
                )
            })}
        </ul>

        

        </>

    )
}

export default Projects;