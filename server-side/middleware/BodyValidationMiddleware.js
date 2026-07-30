
import { z } from "zod";

const BodyValidationMiddleware = (Schema: z.ZodObjec) => {

    return  async (req, res, next) => {
        try{
            const data =  (req.body);
            if(!data ){
                throw {code:400, message:"Data is required"};

            }
            const resposnse=  await Schema.parseAsync(data);
            req.body = resposnse;
            next();
        }catch(exception){
            if(exception instanceof z.ZodError){
                let errBag: Record={}
exception.issues.forEach((err)=>{
                    errBag[err.path[0]] = err.message;
                })
                next({code:400, message:"Validation Error", detail:errBag});
            }else{
                next(exception);
            }


        }
    }

};