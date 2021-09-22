import spinner from '../images/Infinity.svg'

function Spinner({isLoading}) {
    return (
        <img className='loader' src={spinner} alt='лоадер'/>
    )
}

export default Spinner;