package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Cart;
import hibernate.HibernateUtil;
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
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "LoadWishlistItems", urlPatterns = {"/LoadWishlistItems"})
public class LoadWishlistItems extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        User user = (User) req.getSession().getAttribute("user");
        if (user != null) { //db cart
            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();
            Criteria c1 = s.createCriteria(Wishlist.class);
            c1.add(Restrictions.eq("user", user));
            List<Wishlist> wishlistList = c1.list();
            if (wishlistList.isEmpty()) {
                responseObject.addProperty("message", "wishlist is Empty");
            } else {
                for (Wishlist wishlist : wishlistList) {
                    wishlist.getProduct().setUser(null);
                    wishlist.setUser(null);
                }
                responseObject.addProperty("status", true);
                responseObject.addProperty("message", "wishlist items successfully loaded");
                responseObject.add("sessionWishes", gson.toJsonTree(wishlistList));
            }
        } else { //session cart
            ArrayList<Wishlist> sessionWishes = (ArrayList<Wishlist>) req.getSession().getAttribute("sessionWishes");
            if (sessionWishes != null) {
                if (sessionWishes.isEmpty()) {
                    responseObject.addProperty("message", "your wishlist is Empty.");
                } else {
                    for (Wishlist sessionWish : sessionWishes) {
                        sessionWish.getProduct().setUser(null);
                        sessionWish.setUser(null);
                    }
                    responseObject.addProperty("status", true);
                    responseObject.addProperty("message", "Wishlist items successfully loaded");
                    responseObject.add("sessionWishes", gson.toJsonTree(sessionWishes));
                }
            } else {
                responseObject.addProperty("message", "your wishlist is Empty.");
            }
        }
        resp.setContentType("application/json");
        String toJson = gson.toJson(responseObject);
        resp.getWriter().write(toJson);
    }
}
