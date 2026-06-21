import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AppContext } from '../context/AppContext'

const FALLBACK_CATEGORIES = [
  'Парикмахер', 'Мастер маникюра', 'Мастер педикюра', 'Визажист',
  'Бровист', 'Косметолог', 'Массажист', 'Лешмейкер'
]

const useCategories = () => {
  const { backendUrl } = useContext(AppContext)
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES)

  useEffect(() => {
    axios.get(backendUrl + '/api/category/active')
      .then(({ data }) => {
        if (data.success && data.categories.length) {
          setCategories(data.categories.map(category => category.name))
        }
      })
      .catch(error => console.log(error))
  }, [backendUrl])

  return categories
}

export default useCategories
