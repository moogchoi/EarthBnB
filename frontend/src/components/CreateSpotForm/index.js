import SpotForm from "../SpotForm"

const CreateSpotForm = () => {
    const spot = {
        country: '',
        address: '',
        city: '',
        state: '',
        lat: '',
        lng: '',
        description: '',
        name: '',
        price: '',
        previewImage: '',
        image1: '',
        image2: '',
        image3: '',
        image4: '',

    }
    return (
        <SpotForm
        spot={spot}
        formType="Create Spot"/>
    )
}

export default CreateSpotForm
