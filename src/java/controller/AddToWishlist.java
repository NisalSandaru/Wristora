
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Cart;
import hibernate.HibernateUtil;
import hibernate.Product;
import hibernate.User;
import hibernate.Wishlist;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;


@WebServlet(name = "AddToWishlist", urlPatterns = {"/AddToWishlist"})
public class AddToWishlist extends HttpServlet {
@Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String prId = req.getParameter("prId");
        System.out.println(prId);

        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        if (!Util.isInteger(prId)) {
            responseObject.addProperty("message", "Invalid product Id!");
        }else {

            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();
            Transaction tr = s.beginTransaction();

            Product product = (Product) s.get(Product.class, Integer.valueOf(prId));

            if (product == null) {
                responseObject.addProperty("message", "Product Not Found!");
            } else { // product available in db
                User user = (User) req.getSession().getAttribute("user");
                if (user != null) { // add product to bd. user avalilable
                    Criteria c1 = s.createCriteria(Wishlist.class);
                    c1.add(Restrictions.eq("user", user));
                    c1.add(Restrictions.eq("product", product));

                    if (c1.list().isEmpty()) {
                        
                            Wishlist wish = new Wishlist();
                            wish.setUser(user);
                            wish.setProduct(product);

                            s.save(wish);
                            tr.commit();
                            responseObject.addProperty("status", true);
                            responseObject.addProperty("message", "product add to Wishlist successfully");
                        
                    } else {
                            responseObject.addProperty("status", true);
                            responseObject.addProperty("message", "product Already in the Wishlist..!");
                    }
                } else {
                    HttpSession ses = req.getSession();

                    if (ses.getAttribute("sessionWishes") == null) {
                            ArrayList<Wishlist> sessWishes = new ArrayList<>();
                            Wishlist wish = new Wishlist();
                            wish.setUser(null);
                            wish.setProduct(product);
                            sessWishes.add(wish);
                            ses.setAttribute("sessionWishes", sessWishes);
                            responseObject.addProperty("status", true);
                            responseObject.addProperty("message", "Product added to the Wishlist");
                        
                    } else {

                        ArrayList<Wishlist> sessionList = (ArrayList<Wishlist>) ses.getAttribute("sessionWishes");
                        Wishlist foundedWish = null;
                        for (Wishlist wish : sessionList) {
                            if (wish.getProduct().getId() == product.getId()) {
                                foundedWish = wish;
                                break;
                            }
                        }
                        if (foundedWish != null) {
                            
                                responseObject.addProperty("message", "product Already in the Wishlist..!");
                            
                        } else {
                            
                                foundedWish = new Wishlist();
                                foundedWish.setUser(null);
                                foundedWish.setProduct(product);
                                sessionList.add(foundedWish);
                                responseObject.addProperty("status", true);
                                responseObject.addProperty("message", "Product add to the Wishlist");
                            
                        }

                    }
                }
            }

        }

        resp.setContentType("application/json");
        String toJson = gson.toJson(responseObject);
        resp.getWriter().write(toJson);
    }
}
