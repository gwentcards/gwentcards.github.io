import React from 'react';
import './App.css';
import {Table} from 'reactstrap';
import cards from './data/cards';

class App extends React.Component {
    constructor(props) {
        super(props);

        const hash = window.location.hash;
        const parsed = App.parseHash(hash) || {};
        this.state = {checked: parsed};

        this.isChecked = this.isChecked.bind(this);
        this.updateChecked = this.updateChecked.bind(this);
    }

    static parseHash(hash) {
        if (hash.length === 0 || hash.charAt(0) !== '#') {
            return;
        }

        hash = hash.substring(1);

        const c = cards.cards;
        if (c.length !== hash.length) {
            return;
        }

        const obj = {};
        for (let i = 0; i < c.length; i++) {
            const v = hash.charAt(i);
            if (v === '1') {
                obj[c[i].name] = true;
            }
        }
        return obj;
    }

    static buildHash(checked) {
        const arr = [];
        for (let i = 0; i < cards.cards.length; i++) {
            const name = cards.cards[i].name;
            const v = checked.hasOwnProperty(name) && checked[name] ? 1 : 0;
            arr.push('' + v);

        }
        return arr.join('');
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.checked !== prevState.checked) {
            const checked = this.state.checked;
            window.location.hash = App.buildHash(checked);
        }
    }

    updateChecked(name, e) {
        const update = {[name]: e.target.checked};

        this.setState(state => {
            return {checked: {...state.checked, ...update}};
        });
    }

    isChecked(name) {
        const checked = this.state.checked;
        return checked.hasOwnProperty(name) && checked[name];
    }

    render() {
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
                        <tr id={c.name} key={c.name}>
                            <td className="text-center">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id={'collected-' + c.name}
                                           checked={this.isChecked(c.name)}
                                           onChange={this.updateChecked.bind(this, c.name)}/>
                                    <label className="custom-control-label" htmlFor={'collected-' + c.name}/>
                                </div>
                            </td>
                            <td>{c.deck}</td>
                            <td>{c.territory}</td>
                            <td>{c.name}</td>
                            <td>{c.location}</td>
                            <td>{c.details}</td>
                            {/*<td><img src={`http://s3-ap-southeast-2.amazonaws.com/gwentcards.com/${c.name}.jpg`}/></td>*/}
                        </tr>
                    )}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default App;
