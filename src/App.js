import React from 'react';
import './App.css';
import {Table} from 'reactstrap';
import cards from './data/cards';

function App() {
    return (
        <div className="App form-group">
            <Table bordered hover striped responsive size="sm">
                <thead>
                <tr>
                    <th>
                        <div className="input-group-sm">
                            <select className="form-control" placeholder="Collected">
                                <option>Collected: show all</option>
                                <option>Only collected</option>
                                <option>Only not collected</option>
                            </select>
                        </div>
                    </th>
                    <th>
                        <div className="input-group-sm">
                            <select className="form-control" placeholder="Deck">
                                <option>Deck: all</option>
                                <option>Monsters</option>
                                <option>Neutral</option>
                                <option>Nilfgaard</option>
                                <option>Northern Realms</option>
                                <option>Scoia'tael</option>
                            </select>
                        </div>
                    </th>
                    <th>
                        <div className="input-group-sm">
                            <input type="text" className="form-control input-sm" placeholder="Territory"/>
                        </div>
                    </th>
                    <th>
                        <div className="input-group-sm">
                            <input type="text" className="form-control input-sm" placeholder="Name"/>
                        </div>
                    </th>
                    <th>
                        <div className="input-group-sm">
                            <input type="text" className="form-control input-sm" placeholder="Location"/>
                        </div>
                    </th>
                    <th>
                        <div className="input-group-sm">
                            <input type="text" className="form-control input-sm" placeholder="Details"/>
                        </div>
                    </th>
                </tr>
                </thead>
                <tbody>
                {cards.cards.map(c =>
                    <tr id={c.name}>
                        <td className="text-center">
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id={'collected-' + c.name}/>
                                <label className="custom-control-label" htmlFor={'collected-' + c.name}/>
                            </div>
                        </td>
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
