//Product component
export interface Products{
    "Name":string,
    "Code":string,
    "Category":string,
    "Price":number,
    "Description":string,
    "ImageUrl":string,
    "Origin":string
};

//Product component
export interface ProductApi {
    items: Products[];
    total_count: number;
}

// user service
export interface SignUpResponse {
    Errors: {
      Duplicate:boolean
    },
    Massage:String,
    Success:boolean
  }
  
  //user service
  export interface SignInResponse{
    LoggedIn:boolean,
    Message:string,
    Token:string,
    Role:string
  }
  
  //user service
  export interface UserInterface {
    Fullname:string,
    Username:string,
    Email:string,
    Gender:String,
    Phone:String,
    Role:string
  }

  export interface AddProductResponse{
    status:boolean,
    duplicate:boolean,
    massage:string
  }

  export interface UpdateResponse{
    Status:boolean,
    Message:string
  }

  export interface DeleteResponse{
    Status:boolean,
    Message:string
  }

  export interface Cart{
    Product:Products,
    Quantity:number
  }