// src/components/RateMealForm.js
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const meals = {
  1: {
    name: 'Moroccan Spiced Harissa Chicken',
    image: 'https://assets.cookfood.net/product_921_6564.jpg',
  },
  2: {
    name: 'Creamy Chicken with Mushrooms & Bacon',
    image: 'https://assets.cookfood.net/product_2283_6259.jpg',
  },
  3: {
    name: 'Coq au Vin',
    image: 'https://assets.cookfood.net/product_588_6243.jpg',
  },
  4: {
    name: 'Chicken, Pea & Bacon Risotto',
    image: 'https://assets.cookfood.net/product_2050_5229.jpg',
  },
  5: {
    name: 'Chicken & Portobello Mushroom Pie',
    image: 'https://assets.cookfood.net/product_1692_6810.jpg',
  },
  6: {
    name: 'Spring Chicken & Asparagus Pie',
    image: 'https://assets.cookfood.net/product_1764_6815.jpg',
  }
}

const RateMealForm = () => {
  const navigate = useNavigate()
  const { mealId } = useParams()

  const meal = meals[mealId]

  // Form state
  const [rating, setRating] = React.useState(5)
  const [critique, setCritique] = React.useState('')
  const [sideDishes, setSideDishes] = React.useState('')
  const [image, setImage] = React.useState(null)
  const [uploading, setUploading] = React.useState(false)

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id

    if (!userId) {
      alert("You must be logged in to rate a meal")
      return
    }

    let imageUrl = null

    // Upload image if provided
    if (image) {
      setUploading(true)
      const fileExt = image.name.split('.').pop()
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`
      const filePath = `ratings/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('meal-images')
        .upload(filePath, image)

      if (uploadError) {
        alert("Could not upload image")
        setUploading(false)
        return
      }

      const { data } = supabase.storage.from('meal-images').getPublicUrl(filePath)
      imageUrl = data.publicUrl
    }

    // Insert into Supabase
    const { error } = await supabase
      .from('meal_ratings')
      .insert({
        user_id: userId,
        meal_id: parseInt(mealId),
        rating,
        critique,
        suggested_side_dishes: sideDishes,
        image_url: imageUrl
      })

    setUploading(false)

    if (error) {
      alert("Could not save your rating")
      console.error(error)
      return
    }

    alert("Your rating has been saved!")
    navigate('/rate')
  }

  if (!meal) {
    return <div>Meal not found</div>
  }

  return (
    <div className="rate-meal-form">
      <h2>Rate: {meal.name}</h2>
      <img src={meal.image} alt={meal.name} style={{ width: '100%', maxWidth: '400px', borderRadius: '8px' }} />

      <form onSubmit={handleSubmit}>
        <label>
          Rating out of 10:
          <input
            type="number"
            min="1"
            max="10"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            required
          />
        </label>

        <label>
          Critique or Comments:
          <textarea
            value={critique}
            onChange={(e) => setCritique(e.target.value)}
            rows="5"
            placeholder="What did you think? Any suggestions?"
          />
        </label>

        <label>
          Suggested Side Dishes:
          <input
            type="text"
            value={sideDishes}
            onChange={(e) => setSideDishes(e.target.value)}
            placeholder="What sides go well with this meal?"
          />
        </label>

        <label>
          Upload an image of your meal:
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>

        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Save Rating'}
        </button>
      </form>

      {/* Share Button */}
      <div className="share-section">
        <button onClick={() => {
          const url = window.location.href
          const text = `I rated ${meal.name} ★★★★★ on COOK Meals Rankings!`
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
        }}>
          Share on Twitter/X
        </button>
      </div>
    </div>
  )
}

export default RateMealForm