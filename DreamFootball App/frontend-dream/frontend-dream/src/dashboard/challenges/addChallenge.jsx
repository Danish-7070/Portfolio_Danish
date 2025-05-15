import React from 'react'
import AdminSiderbar from '../../components/sidebar/sidebar'
import dfawallpaper from '../../assets/dfa-wallpaper.png'
import AddChallengeForm from '../../components/challenge/addChallengeForm'

const AddChallenge = () => {
  return (
    <div className=""  style={{ backgroundImage: `url(${dfawallpaper})`, backgroundSize: "contain" }}>
      <AdminSiderbar />
      <div className="flex flex-col justify-center gap-4 w-full max-sm:w-full max-md:w-2/3">
      <AddChallengeForm/>
    </div>
    </div>
  )
}

export default AddChallenge
