package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Mail;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author User
 */
@WebServlet(name = "SignUp", urlPatterns = {"/SignUp"})
public class SignUp extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject user = gson.fromJson(req.getReader(), JsonObject.class);

        String firstName = user.get("firstName").getAsString();
        String lastName = user.get("lastName").getAsString();
        final String email = user.get("email").getAsString();
        String password = user.get("password").getAsString();

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        
        if(firstName.isEmpty()){
            responseObject.addProperty("message", "First Name Can not be empty!");
        }else if(lastName.isEmpty()){
            responseObject.addProperty("message", "Last Name Can not be empty!");
        }else if(email.isEmpty()){
            responseObject.addProperty("message", "email Can not be empty!");
        }else if(!Util.isEmailValid(email)){
            responseObject.addProperty("message", "Please enter a valid email!");
        }else if(!Util.isPasswordValid(password)){
            responseObject.addProperty("message", "Password must contains at least uppercase, lowecase, "
                    + "number, special character and to be minimum eight characters long!");
        }else{
            //save
            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();
            
            Criteria criteria = s.createCriteria(User.class);
            criteria.add(Restrictions.eq("email", email));
            
            if(!criteria.list().isEmpty()){
                responseObject.addProperty("message", "User with this Email already exists!");
            }else{
                User u = new User();
                u.setFirst_name(firstName);
                u.setLast_name(lastName);
                u.setEmail(email);
                u.setPassword(password);
                
                //generaete verification code
                final String veriaficationCode = Util.generateCode();
                u.setVerification(veriaficationCode);

                u.setCreated_at(new Date());

                s.save(u);
                s.beginTransaction().commit();
                
                //send mail
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        Mail.sendMail(email, "Wristora - Verification", "<p>Your VerificationCode Is: </p><h1>"+veriaficationCode+"</h1>");
                    }
                }).start();
                
                //session management
                HttpSession ses = req.getSession();
                ses.setAttribute("email", email);
                //
                
                responseObject.addProperty("status", true);
                responseObject.addProperty("message", "Registration sucsess. Please check your email for the verification code");
            }
            s.close();
        }
        
        String responseText = gson.toJson(responseObject);
        resp.setContentType("applicatoin/json");
        resp.getWriter().write(responseText);
    }
}
