import React from 'react';
import './App.css';
import {Table} from 'reactstrap';
import cards from './data/cards';

function App() {
    return (
        <div className="App">
            <Table bordered hover striped responsive>
                <thead>
                <tr>
                    <th>Deck</th>
                    <th>Territory</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Details</th>
                </tr>
                </thead>
                <tbody>
                {cards.cards.map(c =>
                    <tr>
                        <td>{c.deck}</td>
                        <td>{c.territory}</td>
                        <td>{c.name}</td>
                        <td>{c.location}</td>
                        <td>{c.details}</td>
                    </tr>
                )}
                </tbody>
            </Table>
        </div>
    );
}

export default App;
