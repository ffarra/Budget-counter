import './App.css';
import {useEffect, useState} from "react";
import {RiDeleteBack2Line} from "react-icons/ri";
import {useForm} from "react-hook-form";
import api from "./utils/api";

const INCOME = "INCOME";

function App() {
    const [items, setItems] = useState([])
    const [total, setTotal] = useState()
    const [loading, setLoading] = useState(true)
    const { register, handleSubmit, reset } = useForm();
    const [update, setUpdate] = useState(0);
    const [search, setSearch] = useState('')

    const handleSaveItem = async (values) => {
        await api.post('/transactions', {...values, cost: Number(values.cost)});
        reset();
        setUpdate(update + 1);
        getTotal();
    }

    useEffect(() => {
        getTotal();
    }, [])

    const getTotal = () => {
        (async () => {
            try {
                let result = await api.get('/transactions/total')
                setTotal(result.data)
            } catch (e) {
                console.log(e)
            }
        })()
    }

    useEffect(() => {
        (async () => {
            try {
                let result = await api.get('/transactions/find-by-condition', {params: {condition: search}})
                setItems(result.data)
            } catch (e) {
                console.log(e)
            } finally {
                setLoading(false)
            }
        })()
    }, [update, search])

    const handleDelete = async (id) => {
        await api.delete(`/transactions/${id}`)
        setUpdate(update + 1)
        getTotal()
    }

    return loading ? 'Loading...' : (
        <div className="container">
            <h1 className='mt-3'>My budget planner</h1>
            <div className='row mt-3'>
                <div className='col-sm'>
                    <div className='alert alert-info'>
                        <span>budget {total.totalSumIncome}$</span>
                    </div>
                </div>
                <div className='col-sm'>
                    <div className='alert alert-secondary'>
                        <span>remaining {total.totalSumIncome - total.totalSumOutcome}$</span>
                    </div>
                </div>
                <div className='col-sm'>
                    <div className='alert alert-danger'>
                        <span>spent {total.totalSumOutcome}$</span>
                    </div>
                </div>
            </div>

            <h3 className='mt-3'>Search</h3>
            <input value={search} onChange={(e) => setSearch(e.target.value)}  placeholder='search...' id='name' className='form-control mt-4'/>

            <h3 className='mt-3'>Total</h3>

            <div className='row mt-3'>
                <div className='col-sm'>
                    <ul className='list-group'>
                        {items.map((item, index) => {
                                return (
                                    <li key={index}
                                        className={'list-group-item d-flex justify-content-between align-items-center ' + (item.transactionType === INCOME ? 'list-group-item-info' : 'list-group-item-danger')}>
                                        {item.name}
                                        <div>
                                            <button disabled style={{borderRadius: 29, marginRight: 20}}
                                                    className="btn btn-primary">{item.cost}$
                                            </button>
                                            <RiDeleteBack2Line onClick={() => handleDelete(item.id)} size={20}/>
                                        </div>
                                    </li>
                                )
                            }
                        )}
                    </ul>
                </div>
            </div>

            <h3 className='mt-3'>Add income/outcome</h3>
            <form onSubmit={handleSubmit(handleSaveItem)}>
                <div className='row'>
                    <div className='col-sm'>
                        <label htmlFor='name'>Name</label>
                        <input {...register('name')} id='name' className='form-control'/>
                    </div>
                    <div className='col-sm'>
                        <label htmlFor='name'>Cost</label>
                        <input {...register('cost')} id='name' className='form-control'/>
                    </div>
                    <div className='col-sm mt-4'>
                        <select {...register("transactionType")} className="form-select">
                            <option value="OUTCOME">Outcome</option>
                            <option value="INCOME">Income</option>
                        </select>
                    </div>
                </div>
                <button type='submit' className="btn btn-primary mt-3">Save</button>
            </form>
        </div>
    )
}

export default App;
