
export default async function handler(req, res){

  try{

    const response = await fetch(
      'https://api.wise.com/v1/rates?source=USD&target=INR',
      {
        headers:{
          Authorization:
            'Bearer YOUR_WISE_API_KEY'
        }
      }
    );

    const data = await response.json();

    res.status(200).json(data);

  }catch(error){

    res.status(500).json({
      error:'Failed to fetch rates'
    });

  }

}

