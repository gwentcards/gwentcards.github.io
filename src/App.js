import React from 'react';
import './App.css';
import {Button, Input, InputGroup, InputGroupAddon, Table} from 'reactstrap';
import cards from './data/cards';

class App extends React.Component {
    constructor(props) {
        super(props);

        const hash = window.location.hash;
        const parsed = App.parseHash(hash) || {};
        this.state = {checked: parsed, filter: {}, sort: {field: 'name', dir: 'asc'}};

        this.isChecked = this.isChecked.bind(this);
        this.updateChecked = this.updateChecked.bind(this);
        this.updateFilter = this.updateFilter.bind(this);
        this.clearFilter = this.clearFilter.bind(this);
        this.updateSort = this.updateSort.bind(this);
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
        this.setFilter(field, e.target.value);
    }

    clearFilter(field) {
        this.setFilter(field, '');
    }

    setFilter(field, value) {
        this.setState(state => {
            return {filter: {...state.filter, [field]: value}};
        });
    }

    updateSort(field) {
        this.setState(state => {
            const f = state.sort.field;
            const dir = state.sort.dir;

            const newDir = field === f ? (dir === 'asc' ? 'desc' : 'asc') : 'asc';
            return {sort: {field: field, dir: newDir}};
        });
    }

    static containsFilter(objValue, filterValue) {
        if (filterValue === '') {
            return true;
        }
        return objValue.toLowerCase().includes(filterValue);
    }

    sortButton(field) {
        const s = this.state.sort;
        const dir = s.dir;
        const isSorted = s.field === field;
        const newDir = isSorted ? (dir === 'asc' ? 'desc' : 'asc') : 'asc';
        const icon = isSorted ? (dir === 'asc' ? '⬆' : '⬇') : '↕';

        return <Button title={`Sort by ${field} ${newDir}ending`} onClick={this.updateSort.bind(this, field)}>{icon}</Button>;
    }

    compare(a, b, field, dir) {
        if (field === 'collected') {
            const ac = this.isChecked(a.name);
            const bc = this.isChecked(b.name);
            if (ac && !bc) {
                return dir * -1;
            } else if (bc && !ac) {
                return dir * 1;
            }
        } else {
            const r = a[field].localeCompare(b[field]);
            if (r !== 0) {
                return dir * r;
            }
        }

        return field === 'name' ? 0 : a.name.localeCompare(b.name);
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

        const sort = this.state.sort;
        const sortField = sort.field;
        const sortDir = sort.dir === 'asc' ? 1 : -1;
        filtered.sort((a, b) => this.compare(a, b, sortField, sortDir));

        return (
            <div className="App form-group">
                <Table bordered hover striped responsive size="sm">
                    <thead>
                    <tr>
                        <th>
                            <InputGroup size="sm">
                                <InputGroupAddon addonType="prepend">{this.sortButton('collected')}</InputGroupAddon>
                                <Input type="select" placeholder="Collected" onChange={this.updateFilter.bind(this, 'collected')}>
                                    <option value="all">Collected: show all</option>
                                    <option value="yes">Only collected</option>
                                    <option value="no">Only not collected</option>
                                </Input>
                            </InputGroup>
                        </th>
                        <th>
                            <InputGroup size="sm">
                                <InputGroupAddon addonType="prepend">{this.sortButton('deck')}</InputGroupAddon>
                                <Input type="select" placeholder="Deck" onChange={this.updateFilter.bind(this, 'deck')}>
                                    <option value="all">Deck: all</option>
                                    <option value="Monsters">Monsters</option>
                                    <option value="Neutral">Neutral</option>
                                    <option value="Nilfgaard">Nilfgaard</option>
                                    <option value="Northern Realms">Northern Realms</option>
                                    <option value="Scoia'tael">Scoia'tael</option>
                                </Input>
                            </InputGroup>
                        </th>
                        <th>
                            <InputGroup size="sm">
                                <InputGroupAddon addonType="prepend">{this.sortButton('territory')}</InputGroupAddon>
                                <Input bsSize="sm" placeholder="Territory" value={f.territory || ''} onChange={this.updateFilter.bind(this, 'territory')}/>
                                <InputGroupAddon addonType="append" title="Clear territory filter"><Button onClick={this.clearFilter.bind(this, 'territory')}>x</Button></InputGroupAddon>
                            </InputGroup>
                        </th>
                        <th>
                            <InputGroup size="sm">
                                <InputGroupAddon addonType="prepend">{this.sortButton('name')}</InputGroupAddon>
                                <Input bsSize="sm" placeholder="Name" value={f.name || ''} onChange={this.updateFilter.bind(this, 'name')}/>
                                <InputGroupAddon addonType="append" title="Clear name filter"><Button onClick={this.clearFilter.bind(this, 'name')}>x</Button></InputGroupAddon>
                            </InputGroup>
                        </th>
                        <th>
                            <InputGroup size="sm">
                                <InputGroupAddon addonType="prepend">{this.sortButton('location')}</InputGroupAddon>
                                <Input bsSize="sm" placeholder="Location" value={f.location || ''} onChange={this.updateFilter.bind(this, 'location')}/>
                                <InputGroupAddon addonType="append" title="Clear location filter"><Button onClick={this.clearFilter.bind(this, 'location')}>x</Button></InputGroupAddon>
                            </InputGroup>
                        </th>
                        <th>
                            <InputGroup size="sm">
                                <InputGroupAddon addonType="prepend">{this.sortButton('details')}</InputGroupAddon>
                                <Input bsSize="sm" placeholder="Details" value={f.details || ''} onChange={this.updateFilter.bind(this, 'details')}/>
                                <InputGroupAddon addonType="append" title="Clear details filter"><Button onClick={this.clearFilter.bind(this, 'details')}>x</Button></InputGroupAddon>
                            </InputGroup>
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
