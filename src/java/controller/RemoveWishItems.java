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
import java.util.List;
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

@WebServlet(name = "RemoveWishItems", urlPatterns = {"/RemoveWishItems"})
public class RemoveWishItems extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String prId = req.getParameter("prId");
        System.out.println("Product ID to remove: " + prId);

        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        if (!Util.isInteger(prId)) {
            responseObject.addProperty("message", "Invalid product Id!");
        } else {
            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();
            Transaction tr = null;

            try {
                int productId = Integer.parseInt(prId);
                Product product = (Product) s.get(Product.class, productId);

                if (product == null) {
                    responseObject.addProperty("message", "Product not found in database!");
                } else {
                    HttpSession session = req.getSession();
                    User user = (User) session.getAttribute("user");

                    if (user != null) {
                        // Logged-in user: remove from DB cart
                        tr = s.beginTransaction();
                        Criteria c1 = s.createCriteria(Wishlist.class);
                        c1.add(Restrictions.eq("user", user));
                        c1.add(Restrictions.eq("product", product));

                        Wishlist wish = (Wishlist) c1.uniqueResult();

                        if (wish != null) {
                            s.delete(wish);
                            tr.commit();
                            responseObject.addProperty("status", true);
                            responseObject.addProperty("message", "Product removed from your wishlist");
                        } else {
                            responseObject.addProperty("message", "Product not found in your wishlist");
                        }
                    } else {
                        // Guest user: remove from session cart
                        Object sessionObj = req.getSession().getAttribute("sessionWishes");
                        if (sessionObj instanceof List<?>) {
                            List<?> rawList = (List<?>) sessionObj;
                            List<Wishlist> sessionWish = new ArrayList<>();

                            for (Object obj : rawList) {
                                if (obj instanceof Wishlist) {
                                    sessionWish.add((Wishlist) obj);
                                }
                            }

                            Wishlist toRemove = null;
                            for (Wishlist c : sessionWish) {
                                if (c.getProduct().getId() == product.getId()) {
                                    toRemove = c;
                                    break;
                                }
                            }

                            if (toRemove != null) {
                                sessionWish.remove(toRemove);
                                session.setAttribute("sessionWishes", sessionWish);
                                responseObject.addProperty("status", true);
                                responseObject.addProperty("message", "Product removed from session wish");
                            } else {
                                responseObject.addProperty("message", "Product not found in session wish");
                            }
                        } else {
                            responseObject.addProperty("message", "Session wish is empty or invalid");
                        }
                    }
                }
            } catch (Exception e) {
                if (tr != null) {
                    tr.rollback();
                }
                e.printStackTrace();
                responseObject.addProperty("message", "An error occurred: " + e.getMessage());
            } finally {
                s.close();
            }
        }

        // Send JSON response
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();
        out.write(gson.toJson(responseObject));
    }
}
