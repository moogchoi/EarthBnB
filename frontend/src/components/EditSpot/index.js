import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import  { useDispatch, useSelector} from 'react-redux';
import { updateSpot } from '../../store/spots';
import './EditSpot.css';
import { fetchReceiveSpot } from "../../store/spots";

const EditSpotForm = ({spot, formType}) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [country, setCountry] = useState(spot?.country || '');
    const [address, setAddress] = useState(spot?.address || '');
    const [city, setCity] = useState(spot?.city || '');
    const [state, setState] = useState(spot?.state || '');
    const [lat, setLat] = useState(spot?.lat || '');
    const [lng, setLng] = useState(spot?.lng || '');
    const [description, setDescription] = useState(spot?.description || '');
    const [name, setName] = useState(spot?.name || '');
    const [price, setPrice] = useState(spot?.price || '');
    const spotId = useParams().id;

    const currentSpot = useSelector(state=>state.spots[spotId])
    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(fetchReceiveSpot(spotId))
      }, [dispatch, spotId])


    useEffect(() => {
        setCountry(currentSpot?.country || '');
        setAddress(currentSpot?.address || '');
        setCity(currentSpot?.city || '');
        setState(currentSpot?.state || '');
        setLat(currentSpot?.lat || '');
        setLng(currentSpot?.lng || '');
        setDescription(currentSpot?.description || '');
        setName(currentSpot?.name || '');
        setPrice(currentSpot?.price || '');
    }, [currentSpot])


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        spot = {...spot, id: spotId, country, address, city, state, lat: parseFloat(lat), lng: parseFloat(lng), description, name, price: parseFloat(price)}

        let submitSpot = await dispatch(updateSpot(spot))

        if(submitSpot.errors) return setErrors(submitSpot.errors)
        if (submitSpot){
            history.push(`/spots/${submitSpot.id}`)
        }
    }
    useEffect(() => {},[errors])
    return (
        <>
        <div className='newSpotForm'>


        <form className='createForm' onSubmit={handleSubmit}>
        <div>
        <h1>Update your Spot</h1>
        </div>
        <h2>Where's your place located?</h2>
        <h3>Guests will only get your exact address once they booked a reservation</h3>


        <div className='locationDetails'>
        <div className='country'>
        <h3>
        Country</h3><span className="errors">{errors.country}</span>
        <input className='inputfield'
        type="text"
        value={country}
        placeholder='Country'
        onChange={(e)=> setCountry(e.target.value)}/>
        </div>
        <div className='address'>
        <h3>
        Street address</h3><span className="errors">{errors.address}</span>
        <input className='inputfield'
        type='text'
        value={address}
        placeholder='Address'
        onChange={(e)=> setAddress(e.target.value)}></input>

        </div>
        <br></br>
        <div className='cityState'>
    <div className='inputWrapper'>
        <span className="errors">{errors.city}</span>
        <label>
            <span>City</span>
            <input
                type='text'
                value={city}
                placeholder='City'
                onChange={(e) => setCity(e.target.value)}>
            </input>
        </label>
    </div>
    <div className='state inputWrapper'>
        <span className="errors">{errors.state}</span>
        <label>
            <span>State</span>
            <input
                type='text'
                value={state}
                placeholder='STATE'
                onChange={(e) => setState(e.target.value)}>
            </input>
            </label>
            </div>
            </div>
        <div className='latlng'>
        <div className='inputWrapper'>
        <span className="errors">{errors.lat}</span>
        <label>
            <span>Latitude</span>
            <input
                type='number'
                value={lat}
                placeholder='Latitude'
                onChange={(e) => setLat(e.target.value)}
            />
        </label>
    </div>

    <div className='inputWrapper'>
        <span className="errors">{errors.lng}</span>
        <label>
            <span>Longitude</span>
            <input
                type='number'
                value={lng}
                placeholder='Longitude'
                onChange={(e) => setLng(e.target.value)}
            />
        </label>
    </div>
</div>
</div>
        <div className='description'>
        <h2>
        Describe your place to guests </h2>
        <h3>Mention the best features of your space, any special amenities like
            fast wifi or parking, and what you love about the neighborhood.
        </h3>
        <textarea className='inputfield'
        value={description}
        placeholder='What makes your spot, THE SPOT?'
        onChange={(e)=> setDescription(e.target.value)}></textarea>

        </div><span className="errors">{errors.description}</span>
        <div className='spotName'>
        <h2>
        Create a title for your spot</h2>
        <input className='inputfield'
        type='text'
        value={name}
        placeholder='Name of your spot'
        onChange={(e)=> setName(e.target.value)}></input><span className="errors">{errors.name}</span>

        </div>
        <div className='price'>
        <h2>
        Set a base price for your spot</h2>
        <input className='priceinputfield'
        type='number'
        value={price}
        placeholder='Price per night (USD)'
        onChange={(e)=> setPrice(e.target.value)}>

        </input>
        <span className="errors">{errors.price}</span>
        </div>
        <button className='updateSpotButton' type="submit">Update Form</button>
        </form>
        </div>
        </>
    )

}


export default EditSpotForm;
