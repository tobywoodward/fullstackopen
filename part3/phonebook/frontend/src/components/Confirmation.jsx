const Confirmation = ({ message }) => {
    if (message === null) {
        return null
    }
    
    return (
        <div className={'confirmation'}>
            {message}
        </div>
        )
}

export default Confirmation