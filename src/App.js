import React from 'react';
import './App.css';
import {Table} from 'reactstrap';
import cards from './data/cards';

class App extends React.Component {
    constructor(props) {
        super(props);

        const hash = window.location.hash;
        const parsed = App.parseHash(hash) || {};
        this.state = {checked: parsed, filter: {}};

        this.isChecked = this.isChecked.bind(this);
        this.updateChecked = this.updateChecked.bind(this);
        this.updateFilter = this.updateFilter.bind(this);
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
        const checked = e.target.checked;
        this.setState(state => {
            return {checked: {...state.checked, ...{[name]: checked}}};
        });
    }

    isChecked(name) {
        const checked = this.state.checked;
        return checked.hasOwnProperty(name) && checked[name];
    }

    updateFilter(field, e) {
        const value = e.target.value;
        this.setState(state => {
            return {filter: {...state.filter, [field]: value}};
        });
    }

    static containsFilter(objValue, filterValue) {
        if (filterValue === '') {
            return true;
        }
        return objValue.toLowerCase().includes(filterValue);
    }

    render() {
        const f = this.state.filter;
        const collected = f.collected || 'all';
        const deck = f.deck || 'all';
        const territory = (f.territory || '').trim().toLocaleLowerCase();
        const name = (f.name || '').trim().toLocaleLowerCase();
        const location = (f.location || '').trim().toLocaleLowerCase();
        const details = (f.details || '').trim().toLocaleLowerCase();

        const filtered = cards.cards.filter(c => {
            const name = c.name;
            if (collected === 'yes') {
                return this.isChecked(name);
            } else if (collected === 'no') {
                return !this.isChecked(name);
            } else {
                return true;
            }
        }).filter(c => {
            if (deck === 'all') {
                return true;
            }
            return c.deck === deck;
        })
            .filter(c => App.containsFilter(c.territory, territory))
            .filter(c => App.containsFilter(c.name, name))
            .filter(c => App.containsFilter(c.location, location))
            .filter(c => App.containsFilter(c.details, details));

        return (
            <div className="App form-group">
                <Table bordered hover striped responsive size="sm">
                    <thead>
                    <tr>
                        <th>
                            <div className="input-group-sm">
                                <select className="form-control" placeholder="Collected" onChange={this.updateFilter.bind(this, 'collected')}>
                                    <option value="all">Collected: show all</option>
                                    <option value="yes">Only collected</option>
                                    <option value="no">Only not collected</option>
                                </select>
                            </div>
                        </th>
                        <th>
                            <div className="input-group-sm">
                                <select className="form-control" placeholder="Deck" onChange={this.updateFilter.bind(this, 'deck')}>
                                    <option value="all">Deck: all</option>
                                    <option value="Monsters">Monsters</option>
                                    <option value="Neutral">Neutral</option>
                                    <option value="Nilfgaard">Nilfgaard</option>
                                    <option value="Northern Realms">Northern Realms</option>
                                    <option value="Scoia'tael">Scoia'tael</option>
                                </select>
                            </div>
                        </th>
                        <th>
                            <div className="input-group-sm">
                                <input type="text" className="form-control input-sm" placeholder="Territory" onChange={this.updateFilter.bind(this, 'territory')}/>
                            </div>
                        </th>
                        <th>
                            <div className="input-group-sm">
                                <input type="text" className="form-control input-sm" placeholder="Name" onChange={this.updateFilter.bind(this, 'name')}/>
                            </div>
                        </th>
                        <th>
                            <div className="input-group-sm">
                                <input type="text" className="form-control input-sm" placeholder="Location" onChange={this.updateFilter.bind(this, 'location')}/>
                            </div>
                        </th>
                        <th>
                            <div className="input-group-sm">
                                <input type="text" className="form-control input-sm" placeholder="Details" onChange={this.updateFilter.bind(this, 'details')}/>
                            </div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map(c =>
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
