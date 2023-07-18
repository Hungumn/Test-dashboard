const Breadcrumb = (props) => {
  const title = props.title
  return (
    <section className='breadcrumb'>
      <div className='container'>
        <ul className='breadcrumb-list'>
          <li>
            <a href='/home-page'>
              <i className='icon-home'></i>
            </a>
          </li>
          <li>{title}</li>
        </ul>
      </div>
    </section>
  )
}

export default Breadcrumb
