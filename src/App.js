import React from 'react';
import './App.css';
import {
    Button,
    CustomInput,
    Input,
    InputGroup,
    InputGroupAddon,
    Popover,
    PopoverBody,
    PopoverHeader,
    Progress,
    Table
} from 'reactstrap';
import cards from './data/cards';
import GithubMark from './assets/GitHub-Mark-32px.png';

class App extends React.Component {
    constructor(props) {
        super(props);

        const hash = window.location.hash;
        const parsed = App.parseHash(cards.cards, hash) || {};
        this.state = {checked: parsed, filter: {}, sort: {field: 'name', dir: 'asc'}, picture: null};

        this.isChecked = this.isChecked.bind(this);
        this.noop = this.noop.bind(this);
        this.toggleChecked = this.toggleChecked.bind(this);
        this.updateFilter = this.updateFilter.bind(this);
        this.clearFilter = this.clearFilter.bind(this);
        this.updateSort = this.updateSort.bind(this);
        this.checkAll = this.checkAll.bind(this);
        this.showPicture = this.showPicture.bind(this);
    }

    static parseHash(c, hash) {
        if (hash.length < 2 || hash.charAt(0) !== '#') {
            return;
        }

        hash = hash.substring(1);

        const obj = {};
        const n = Math.min(c.length, hash.length);
        for (let i = 0; i < n; i++) {
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

    noop() {
    }

    toggleChecked(name, e) {
        e.preventDefault(); // Otherwise the click will go to the checkbox, then bubble up to the td, and trigger again
        const checked = this.isChecked(name);
        this.setState(state => {
            return {checked: {...state.checked, ...{[name]: !checked}}};
        });
    }

    checkAll(check) {
        const filtered = this.filteredCards();
        this.setState(state => {
            const checked = {...state.checked};
            for (const f of filtered) {
                checked[f.name] = check;
            }
            return {checked: checked};
        })
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

    countCards() {
        const r = {};
        const checked = this.state.checked;
        let totalCollected = 0;
        for (const c of cards.cards) {
            const deck = c.deck;
            const delta = checked[c.name] ? 1 : 0;
            totalCollected += delta;

            if (!r[deck]) {
                r[deck] = {collected: delta, total: 1};
            } else {
                r[deck].total++;
                r[deck].collected += delta;
            }
        }
        return [totalCollected, r];
    }

    static percentage(part, total) {
        return part === 0 ? 0 : part === total ? 100 : Math.floor(part / (total / 100.0));
    }

    static printCardCount(counts) {
        const {total: t, collected: c} = counts;
        return `${c}/${t} (${App.percentage(c, t)}%)`;
    }

    static progress(total, counts, deck, color) {
        const c = counts[deck];
        const caption = `${deck} ${App.printCardCount(c)}`;
        return <Progress striped bar color={color} max={total} value={c.collected}><span title={caption}>{caption}</span></Progress>
    }

    filteredCards() {
        const f = this.state.filter;
        const collected = f.collected || 'all';
        const deck = f.deck || 'all';
        const territory = (f.territory || '').trim().toLocaleLowerCase();
        const name = (f.name || '').trim().toLocaleLowerCase();
        const type = (f.type || '').trim().toLocaleLowerCase();
        const details = (f.details || '').trim().toLocaleLowerCase();

        return cards.cards.filter(c => {
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
            .filter(c => App.containsFilter(c.type, type))
            .filter(c => App.containsFilter(c.details, details));
    }

    showPicture(name) {
        this.setState({picture: name});
    }

    render() {
        const f = this.state.filter;
        const filtered = this.filteredCards();

        const sort = this.state.sort;
        const sortField = sort.field;
        const sortDir = sort.dir === 'asc' ? 1 : -1;
        filtered.sort((a, b) => this.compare(a, b, sortField, sortDir));

        const [totalCollected, counts] = this.countCards();
        const totalCount = cards.cards.length;

        const picture = this.state.picture;
        return (
            <div className="App container-fluid">
                <div className="row mb-2">
                    <div className="col">
                        <Button size="sm" onClick={this.checkAll.bind(this, true)}>Check all visible</Button>{' '}
                        <Button size="sm" onClick={this.checkAll.bind(this, false)}>Uncheck all visible</Button>
                    </div>
                    <div className="col text-right">
                        Showing {filtered.length} of {totalCount} cards. Collected {totalCollected} ({App.percentage(totalCollected, totalCount)}%).
                    </div>
                </div>
                <div className="row mb-2"><div className="col">
                    <Progress multi max={cards.cards.length}>
                        {App.progress(totalCount, counts, 'Nilfgaard', 'warning')}
                        {App.progress(totalCount, counts, 'Monsters', 'danger')}
                        {App.progress(totalCount, counts, 'Northern Realms', 'primary')}
                        {App.progress(totalCount, counts, 'Scoia\'tael', 'success')}
                        {App.progress(totalCount, counts, 'Neutral', 'secondary')}
                    </Progress>
                </div></div>
                <div className="row mb-2"><div className="col">
                    <Table bordered hover striped responsive size="sm" className="space">
                        <thead>
                        <tr>
                            <th>
                                <InputGroup size="sm">
                                    <InputGroupAddon addonType="prepend">{this.sortButton('collected')}</InputGroupAddon>
                                    <CustomInput id="filter-collected" type="select" placeholder="Collected" onChange={this.updateFilter.bind(this, 'collected')}>
                                        <option value="all">Collected: show all</option>
                                        <option value="yes">Only collected</option>
                                        <option value="no">Only not collected</option>
                                    </CustomInput>
                                </InputGroup>
                            </th>
                            <th>
                                <InputGroup size="sm">
                                    <InputGroupAddon addonType="prepend">{this.sortButton('deck')}</InputGroupAddon>
                                    <CustomInput id="filter-deck" type="select" placeholder="Deck" onChange={this.updateFilter.bind(this, 'deck')}>
                                        <option value="all">Deck: all</option>
                                        <option value="Monsters">Monsters</option>
                                        <option value="Neutral">Neutral</option>
                                        <option value="Nilfgaard">Nilfgaard</option>
                                        <option value="Northern Realms">Northern Realms</option>
                                        <option value="Scoia'tael">Scoia'tael</option>
                                    </CustomInput>
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
                                    <InputGroupAddon addonType="prepend">{this.sortButton('type')}</InputGroupAddon>
                                    <Input bsSize="sm" placeholder="Type" value={f.type || ''} onChange={this.updateFilter.bind(this, 'type')}/>
                                    <InputGroupAddon addonType="append" title="Clear type filter"><Button onClick={this.clearFilter.bind(this, 'type')}>x</Button></InputGroupAddon>
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
                        {filtered.map((c, idx) =>
                            <tr id={c.name} key={c.name}>
                                <td className="text-center cursor-pointer" onClick={this.toggleChecked.bind(this, c.name)}>
                                    <div className="custom-control custom-checkbox cursor-pointer">
                                        <input type="checkbox" className="custom-control-input cursor-pointer" id={`collected-${idx}`} checked={this.isChecked(c.name)} onChange={this.noop}/>
                                        <label className="custom-control-label cursor-pointer" htmlFor={`collected-${idx}`}/>
                                    </div>

                                </td>
                                <td>{c.deck}</td>
                                <td>{c.territory}</td>
                                <td>
                                    <span onMouseEnter={this.showPicture.bind(this, c.name)} onMouseLeave={this.showPicture.bind(this, null)}>
                                        <span className="cursor-pointer dotted" id={`name-${idx}`}>{c.name}</span>
                                        {picture && picture === c.name &&
                                        <Popover placement="right" isOpen={true} target={`name-${idx}`} fade={false}>
                                            <PopoverHeader>{c.name}</PopoverHeader>
                                            <PopoverBody>
                                                <a href={`https://witcher.fandom.com/wiki/${c.name.replace(/\(\d of \d\)/, '').trim().replace(/ /g, '_')}_(gwent_card)`}>{c.name.replace(/\(\d of \d\)/, '').trim()} on Witcher wiki</a><br/>
                                                <a href={`${process.env.PUBLIC_URL}/pictures/${c.picture}`} target="_blank" rel="noopener noreferrer"><img className="card-picture" src={`${process.env.PUBLIC_URL}/pictures/${c.picture}`} alt={`Not found: ${c.name}`}/></a>
                                            </PopoverBody>
                                        </Popover>
                                        }
                                    </span>
                                </td>
                                <td>{c.type}</td>
                                <td>{c.details}</td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </div></div>
                <div className="row mb-2"><div className="col text-center small">
                    <p>Pictures and a lot of information taken from <a href="https://witcher.fandom.com/">Witcher Wiki | FANDOM powered by Wikia</a> under <a href="https://www.fandom.com/licensing">CC BY-SA license</a>.</p>
                    <p>Card data: <a href={`${process.env.PUBLIC_URL}/cards.json`}>in JSON format</a> | <a href="https://github.com/gwentcards/gwentcards.github.io/blob/develop/cards.txt">in TAB separated text format</a>.</p>
                    <p><a href="https://github.com/gwentcards/gwentcards.github.io/"><img src={GithubMark} alt="Source code on Github" title="Source code on Github"/></a></p>
                </div></div>
            </div>
        );
    }
}

export default App;
